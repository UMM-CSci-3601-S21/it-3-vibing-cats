import { ContextPackService } from './../../services/contextPack-service/contextpack.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoginService } from 'src/app/services/login-service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../services/user-service/user.service';
import { Component, OnInit } from '@angular/core';
import { Learner } from 'src/app/datatypes/learner';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-edit-learner',
  templateUrl: './edit-learner.component.html',
  styleUrls: ['./edit-learner.component.scss']
})
export class EditLearnerComponent implements OnInit {

  learner: Learner;
  id: string;
  name: string;
  uploading;
  downloadURL: any;
  uploaded: boolean;
  delClicked = false;
  learnerPacks;
  userPacks;

  constructor(
    private users: UserService,
    private route: ActivatedRoute,
    private login: LoginService,
    private storage: AngularFireStorage,
    private packs: ContextPackService,
    private router: Router,
    private files: FileService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      this.users.getLearner(this.login.authID, this.id).subscribe(res => {
        this.learner = res;
        this.name = res.name;
        this.downloadURL = res.icon;
        this.packs.getLearnerPacks(this.login.authID, this.id).subscribe(p => {
          this.learnerPacks = p;
          this.packs.getUserPacks(this.login.authID).subscribe(px => {
            this.userPacks = px;
          });
        });
      }
      );
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
  exists(pack) {
    return this.learnerPacks.some(p => p._id === pack._id);
  }
  remove(pack) {
    console.log('agsgfag');

    this.learnerPacks = this.learnerPacks.filter(p => p._id !== pack._id);
  }
  add(pack) {
    this.learnerPacks.push(pack);
  }

  saveChanges() {
    this.users.editLearner(
      this.login.authID,
      this.learner._id,
      {
        _id: this.learner._id,
        name: this.name,
        icon: this.downloadURL,
        learnerPacks: this.learnerPacks.map(l => l._id)
      }
    ).subscribe(res => {
      this.router.navigate(['/home']);
    }, err => console.log(err)
    );
    // console.log({learner: this.learner._id,name: this.name, icon: this.downloadURL, learnerPacks: this.learnerPacks });

  }
  delete() {
    this.users.removeLearner(this.login.authID, this.learner._id).subscribe(_res=>this.router.navigate(['home']));
    console.log('del');
  }
}
