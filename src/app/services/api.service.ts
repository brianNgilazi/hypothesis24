import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APOD, WOTD } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  private wotd$: Observable<WOTD>;

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  /**
   * Get the astronomy picture of the day
   * @returns An observable that emits the APOD
   */
  getAPOD(){
    return this.http.get<APOD>(environment.apod.url);
  }

  getWOTD(){
    if (!this.wotd$){
      this.wotd$ = this.firestore.collection<WOTD>('words').doc('today').valueChanges();
    }
    return this.wotd$;
    // this.http.get<WOTD>(' https://us-central1-hypothesis-24.cloudfunctions.net/helloWorld');
  }

}
