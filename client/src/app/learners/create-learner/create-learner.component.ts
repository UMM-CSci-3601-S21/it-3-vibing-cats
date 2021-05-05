import { LoginService } from 'src/app/services/login-service/login.service';
import { UserService } from './../../services/user-service/user.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-create-learner',
  templateUrl: './create-learner.component.html',
  styleUrls: ['./create-learner.component.scss']
})
export class CreateLearnerComponent implements OnInit {
  uploading;
  downloadURL: any;
  uploaded: boolean;
  name: string;
  constructor(
    private storage: AngularFireStorage,
    private users: UserService,
    private login: LoginService,
    private files: FileService,
    private router: Router
    ) { }

  ngOnInit(): void {
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
  createLearner(){
    this.users.createLearner(this.login.authID,{name:this.name,icon:this.downloadURL,learnerPacks:[]})
     .subscribe(_=>{
       this.router.navigate(['/home']);
     }, err=>console.log(err)
     );

  }
}
