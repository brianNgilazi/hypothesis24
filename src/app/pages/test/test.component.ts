import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { APOD } from 'src/app/models/api.model';
import { APIService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})


export class TestComponent implements OnInit {

  results$: Observable<string[]> = null;
  apod$: Observable<APOD>;
  searchControl = new FormControl('', [Validators.required]);
  params = new HttpParams();


  constructor(private http: HttpClient, private apiService: APIService) { }

  ngOnInit(): void {
    this.apod$ =  this.getImage();
  }

  search(){
    const query = this.searchControl.value as string;
    this.params = this.params.set('ml', query).set('max', '50');
    this.results$  = this.http.get<{word: string, score: any}[]>('https://api.datamuse.com/words', {params: this.params})
    .pipe(map(words => {
      return words.map(word => word.word);
    }));
  }

  getImage(){
    return this.apiService.getAPOD();
  }

}
