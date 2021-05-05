import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/file.service';
import { LoginService } from 'src/app/services/login-service/login.service';
import { ContextPack } from '../../datatypes/contextPacks';
import { ContextPackService } from '../../services/contextPack-service/contextpack.service';


@Component({
  selector: 'app-add-cp',
  templateUrl: './add-contextPacks.component.html',
  styleUrls: ['./add-contextPacks.component.scss']
})
export class AddContextPackComponent implements OnInit {

  addContextPackForm: FormGroup;
  contextPack: ContextPack;
  uploading: boolean;
  enabled = true;
  selected = true;

  addCpValidationMessages = {
    name: [
      { type: 'required', message: 'A name is required' },
      { type: 'maxlength', message: 'The name cannot exceed 50 characters' },
      { type: 'existingName', message: 'This name has already been taken' }
    ]
  };
  downloadURL ='';
  uploaded = false;

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private cpService: ContextPackService,
    private snackBar: MatSnackBar,
    private files: FileService,
    private login: LoginService,
    private router: Router) { }

  createForms() {
    this.addContextPackForm = this.fb.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
      ])),
    });
  }

  ngOnInit(): void {
    this.createForms();
  }

  submitForm() {
    const {name} = this.addContextPackForm.value;
    this.cpService.addNewContextPackToUser(this.login.user.authId, {name, icon: this.downloadURL,
      enabled:this.enabled,wordlists:[]}).subscribe(newID => {
      this.snackBar.open('Added the ' + this.addContextPackForm.value.name + ' context pack successfully', null, {
        duration: 2000,
      });
      this.router.navigate(['/packs/', newID]);
    }, err => {
      console.log(err);
      this.snackBar.open('Failed to add the context pack', 'OK', {
        duration: 5000,
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
