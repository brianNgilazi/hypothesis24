import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private fireStorage: AngularFireStorage) { }

  /**
   * @param file The file to be uploaded
   * @param path The storage location/'parent directory' to store the file
   * @returns The url of where the file was placed or null if the file was not uploaded
   */
  async upload(file: File, path: string, fileName?: string) {
    // random name to ensure uniqueness
    fileName = fileName || Math.random().toString(36).substring(2);

    if (!path.endsWith('/')) {
        path = path + '/';
    }
    // create a reference to the storage bucket location
    const ref = this.fireStorage.ref(`${path}/${fileName}`);

    // the put method creates an AngularFireUploadTask
    // and kicks off the upload could use fireStorage.upload() instead
    const url = await ref.put(file).then(async snapshot => {
      return  await snapshot.ref.getDownloadURL();
    }).catch(error => {
      return null;
    });

    return url;
  }

   /**
    * @param file The file to be uploaded
    * @param fullPath The storage location or 'parent directory' to store the file
    * @returns A promise with the upload task for this operation
    */
  uploadTask(file: File, fullPath: string) {

    // the put method creates an AngularFireUploadTask
    // create a reference to the storage bucket location
     const ref = this.fireStorage.ref(fullPath);
     return ref.put(file);
  }

  /**
   * Delete the file stored at the given url
   * @param url URL of the file
   */
  deleteFile(url: string) {
    return this.fireStorage.storage.refFromURL(url).delete();
  }

  /**
   * Get a reference to a file in storage
   * @param path the path of the file
   * @returns the reference to the file in storage
   */
  getRef(path){
    return this.fireStorage.ref(path);
  }

  //#region Helpers
  private _deleteFromPath(filePath: string) {
    return this.fireStorage.ref(filePath).delete();
  }
  //#endregion


}
