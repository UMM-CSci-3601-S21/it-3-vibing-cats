/* eslint-disable max-len */
import { Router } from '@angular/router';
import { LoginService } from './../../services/login-service/login.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginEmail: string;
  loginPass='';
  signUpName: string;
  signUpPass='';
  signUpEmail: string;

  loginForm: FormGroup;
  signUpForm: FormGroup;

  downloadURL = '';
  uploaded: boolean;
  uploading: boolean;



  constructor(
    private login: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private storage: AngularFireStorage,
    private files: FileService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    console.log(this.login.user);
    // this.createForms();
    if (this.login.isLoggedIn) {
      this.router.navigate(['home']);
    };
  }
  signIn(){
    return  this.login.signIn(this.loginEmail, this.loginPass, (uid) => {
      console.log(uid);
      this.snackBar.open('Signed in successfully!', null, {
        duration: 3000
      });
      this.router.navigate(['home']);
    }, (err) => {
      this.snackBar.open(err, null, {
        duration: 3000,
        panelClass: ['snackbar-dark-theme']
      });
    });
  }
  signUp(){
    return  this.login.signUp(this.signUpName,this.downloadURL, this.signUpEmail, this.signUpPass, (uid) => {
      console.log(uid);
      this.snackBar.open('Signed up successfully!', null, {
        duration: 3000,
      });
      this.router.navigate(['home']);
    }, (err) => {
      this.snackBar.open(err, null, {
        duration: 3000,
        panelClass: ['snackbar-dark-theme']
      });
    });
  }
  onFileAdded(event) {
    this.files.onFileAdded(event, () => {
      this.uploading = true;
    }, (link) => {
      this.downloadURL = link;
      this.uploaded = true;
      this.uploading = false;
    });
  }
}
