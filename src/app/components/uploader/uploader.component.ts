import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { StorageFile } from 'src/app/models/storage-file.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  @Input() parentPath: string;
  @Input() fileName: string;

  @Output() uploaded = new EventEmitter<StorageFile>();
  @Output() deleted =  new EventEmitter<StorageFile>();
  @Output() cancelled =  new EventEmitter<any>();

  task: AngularFireUploadTask;
  percentage: Observable<string>;
  snapshot: Observable<any>;
  downloadURL: string;
  filePath: string;
  uploadComplete = false;
  inProgress = false;


  constructor(private storage: StorageService) { }

  ngOnInit(): void {
  }

  startUpload(event) {
    const file: File = event.target.files[0];
    // The storage path
    this.parentPath = this.parentPath || 'files';
    const fileSize = Number((file.size / 1000000).toFixed(2));
    if (fileSize > 1){
      window.alert(`The Image you have selected is too large (${fileSize} MB). Image size should not be larger than 1 MB`);

      return;
    }
    this.filePath = `${this.parentPath}/${file.name || this.fileName || Math.random().toString(36).substring(2)}`;


    // The main task
    this.task = this.storage.uploadTask(file, this.filePath);
    this.inProgress = true;
    const fileRef = this.storage.getRef(this.filePath);

    // Progress monitoring
    this.percentage = this.task.percentageChanges().pipe(map(num => {
      return `${num}%`;
    }));

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(),
      // The file's download URL
      finalize( async () =>  {
        this.downloadURL = await fileRef.getDownloadURL().toPromise();
        this.inProgress = false;
        this.uploadComplete = true;
        this.uploaded.emit({path: this.filePath, parentPath: this.parentPath, url: this.downloadURL});
      }),
    );
    this.snapshot.subscribe();
  }

  cancelUpload() {
    this.task.cancel();
    this.cancelled.emit();
  }

  deleteUpload() {
    if (this.uploadComplete) {
      this.deleted.emit({path: this.filePath, parentPath: this.parentPath, url: this.downloadURL});
      this.storage.deleteFile(this.filePath);
    } else { this.cancelUpload(); }
  }

}
