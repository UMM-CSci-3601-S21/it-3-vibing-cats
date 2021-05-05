/* eslint-disable max-len */
import { Injectable} from '@angular/core';
import { User } from 'src/app/datatypes/user';


@Injectable()
export class LoginServiceMock {
  userData: any; // Save logged in user data
  emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  signedIn = false;
  currentUser = null;

  users = [
    { email: 'biruk@gmail.com', password: 'BirukMengistu', uid:'123'},
    { email: 'elena@gmail.com', password: 'ElenaLam', uid:'456' }
  ];

  storage={};

  constructor(user?) {
    this.currentUser = user;
  }

  // Sign in with email/password
  signIn(email: string, password, then: (uid) => any, err: (msg) => any) {
    return new Promise<any>((resolve, reject) => {
      if (this.emailPattern.test(email) && password ? password.length : false) {
        if (this.users.some(user => user.email === email && user.password === password) ) {
          then('someuserdata');
          this.signedIn = true;
          this.currentUser = this.users[0];
          resolve('someuserdata');
          return 'someuserdata';
        } else {
          reject('The account you entered does not exist.');
          return 'The account you entered does not exist.';
        }
      } else {
        err('Error');
        reject('Error');
        return 'Error';
      }
    });
  }

  // Sign up with email/password
  signUp(name, icon, email, password, then: (res) => any, error: (err) => any) {
    return new Promise<any>((resolve, reject) => {
      if (this.emailPattern.test(email) && password ? password.length > 0 : false) {
        this.users.push({email,password,uid:`${Date.now()}`});
        then('someuserdata');
        resolve('someuserdata');
      } else {
        error('Error');
        reject('Error');
      }
    });
  }


  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    return this.signedIn;
  }
  set loggedIn(s) {
    this.signedIn = s;
  }
  get user() {
    return this.currentUser;
  }
  get authID() {
    return this.currentUser ? this.currentUser.uid : null;
  }
  // // Sign in with Google
  // googleAuth() {
  //   return this.authLogin(new auth.GoogleAuthProvider());
  // }

  // Auth logic to run auth providers
  // authLogin(provider) {
  //   return this.afAuth.signInWithPopup(provider)
  //     .then((result) => {
  //       this.ngZone.run(() => {
  //         this.router.navigate(['dashboard']);
  //       });
  //       this.setUserData(result.user);
  //     }).catch((error) => {
  //       window.alert(error);
  //     });
  // }

  // /* Setting up user data when sign in with username/password,
  // sign up with username/password and sign in with social auth
  // provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  // setUserData(user) {
  //   this.storage = user;
  // }

  // // Sign out
  // signOut(then: (res) => any) {
  //   return new Promise<any>((resolve, reject) => {
  //     if(!this.signedIn){
  //       reject('Error');
  //     } else {
  //       then(this.currentUser);
  //       resolve(this.currentUser);
  //       this.signedIn = false;
  //       this.currentUser = null;
  //       this.storage = null;
  //     }
  //   });
  // }
}


