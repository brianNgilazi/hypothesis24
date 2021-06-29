import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User|null>;
  currentUser: User;

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) {
    this.setUser();
  }

  private setUser() {
    this.user$ = this.auth.authState.pipe(
      switchMap(firebaseUser => {
        if (firebaseUser) {
          return this.firestore.doc<User>(`users/${firebaseUser.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }));
    this.user$.subscribe(user => this.currentUser = user);
  }

  private updateUserData(firebaseUser: firebase.default.User, formVal?: any) {
    firebaseUser.updateProfile({displayName: formVal.username});
    const userRef: AngularFirestoreDocument<User> = this.firestore.doc(`users/${firebaseUser.uid}`);
    let userData: User;


    userRef.snapshotChanges().pipe(take(1)).subscribe(doc => {
      if ( doc.payload.exists) {
          userData = doc.payload.data();
      } else {
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: formVal.username,
          created:  new Date(firebaseUser.metadata.creationTime),
        };
      }
      return userRef.set(userData, { merge: true });

    }
     );

  }

  signIn(value: { email: any; password: any; }) {
  return new Promise<any>((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(value.email, value.password)
      .then(userCredentials => resolve(userCredentials),
      err => reject(this.parseErrorCodes(err.code))).catch(() => reject('Error Signing In. \
      Please try again later or contact the administrator'));
    });
  }

  signOut() {
    return this.auth.signOut().then(() => this.router.navigate(['home']));
  }

  signUp(value) {
    return new Promise<any>((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(value.email, value.password)
      .then(credentials => {
      credentials.user.updateProfile({displayName: value.username});
      this.updateUserData(credentials.user, value);
      resolve(credentials);
      }, err => reject(this.parseErrorCodes(err.code)));
    });
  }

  // googleSignin() {
  //   return new Promise<any>((resolve, reject) => {
  //     const provider = new firebase.default.auth.GoogleAuthProvider();
  //     this.auth.signInWithRedirect(provider);
  //     this.auth.getRedirectResult().then(userCredentials => {
  //     this.updateUserData(userCredentials.user);
  //     resolve(userCredentials);
  //     }, error => reject(error));
  //   });

  // }



  private parseErrorCodes(errorCode: string): string{
    let errorMessage = '';
    switch (errorCode){
      case 'auth/wrong-password':
        errorMessage = 'Invalid Password';
        break;
      case 'auth/user-not-found':
        errorMessage = 'There is no account associated with this email address. Sign up to continue';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled. Please contact the administrator for more info.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Email address already in use.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Please select a stronger password';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network Error. Please check your internet connection or try again later.';
        break;
    }
    return errorMessage;
  }

  /**
   * Updates the user profile
   * @param user the updated user object
   */
  updateProfile(user: User){
    this.firestore.collection('users').doc(user.uid).update(user);
  }





}
