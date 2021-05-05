/* eslint-disable no-underscore-dangle */
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user-service/user.service';
import { User } from 'src/app/datatypes/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userData: any; // Save logged in user data
  signedIn: any;
  _user: any;

  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private users: UserService,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
  }

  // Sign in with email/password
  signIn(email, password, then: (uid) => any, err: (msg) => any) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => this.ngZone.run(() => {
        this.users.getUser(result.user.uid).subscribe(user => {
          this.setUserData(user);
          then(result.user.uid);
        }, error =>
          err(JSON.stringify(error).includes('404') ? 'Not found' : JSON.stringify(error))
        );
      })
      ).catch((error) => {
        console.log(JSON.stringify(error));
        err(this.convertMessage(error.code));
      });
  }

  // Sign up with email/password
  signUp(name, icon, email, password, then: (res) => any, err: (e) => any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user: User = {
          authId: result.user.uid,
          name,
          icon,
          learners: [],
          contextPacks: []
        };
        this.users.createUser(user).subscribe(_ => {
          this.setUserData(user);
          then(result);
        }, error => err(JSON.stringify(error)));
      }).catch((e) => {
        console.log(JSON.stringify(e));
        err(this.convertMessage(e.code));
      });
  }

  convertMessage(err) {
    switch (err) {
      case 'auth/email-already-in-use': //when the email is already in use
        return ('The email you entered is already in use.');
      case 'auth/weak-password': //when you put in a password of less than 6 characters
        return ('Your password must be at least 6 characters long.');
      case 'auth/argument-error':
        return ('Please enter a valid email and password first.');
      case 'auth/user-not-found':
        return ('The account you entered does not exist.');
      case 'auth/invalid-email':
        return ('The email you entered is invalid.');
      case 'auth/wrong-password':
        return ('Password is incorrect.');
      default:
        return (err);
    }
  }

  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    const val = localStorage.getItem('user');
    let user = null;
    if (val !== 'undefined') { user = JSON.parse(val); }
    console.log(user !== null);
    return user !== null;
  }
  set loggedIn(s) {
    this.signedIn = s;
  }
  get user() {
    const val = localStorage.getItem('user');
     this._user = null;
    if(val !== 'undefined'){
      this._user = JSON.parse(val);
    }
    console.log(this._user);
    return this._user;
  }

  set user(x) {
    this._user = x;
  }
  get authID() {
    return this.user ? this.user.authId : null;
  }

  setUserData(user) {
    localStorage.setItem('user', JSON.stringify(user));
    JSON.parse(localStorage.getItem('user'));
  }

  // Sign out
  signOut(then: (res) => any, err: (some) => any) {
    return this.afAuth.signOut().then(res => {
      localStorage.setItem('user', null);
      then(res);
    }, error => err(error));
  }
}
