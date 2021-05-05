import { UserService } from './../../services/user-service/user.service';
import { LoginService } from './../../services/login-service/login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContextPack } from '../../datatypes/contextPacks';
import { WordList } from '../../datatypes/wordlist';
import { ContextPackService } from '../../services/contextPack-service/contextpack.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { safe } from 'src/testing/utils';
import { Learner } from 'src/app/datatypes/learner';

@Component({
  selector: 'app-display-context-packs',
  templateUrl: './display-context-packs.component.html',
  styleUrls: ['./display-context-packs.component.scss']
})
export class DisplayContextPacksComponent implements OnInit, OnDestroy {

  public contextPacks: ContextPack[];
  public name: string;
  public icon: string;
  public enabled: boolean;
  public wordlist: Array<WordList>;
  public learners: Learner[] = [];
  getPackSub: Subscription;

  verbCount;
  adjectiveCount;
  miscCount;
  nounCount;

  assignedCount;
  unAssignedCount;

  enabledCount;
  disabledCount;

  lExpanded = false;


  constructor(private packService: ContextPackService, private router: Router,
    private login: LoginService,
    private users: UserService
  ) { }

  getPacksFromServer(): void {
    this.unsub();
    this.getPackSub = this.packService.getUserPacks(this.login.user.authId).subscribe(
      returnedPacks => {
        this.contextPacks = returnedPacks;
        this.users.getLearners(this.login.authID).subscribe(learners => {
          this.learners = learners;
          this.initValues();
          this.count();
        });
      }, err => {
        console.log(err);
      });
    safe(() => { this.name = this.login.user.name; }, this.login.user);

  }

  ngOnInit(): void {
    this.getPacksFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getPackSub) {
      this.getPackSub.unsubscribe();
    }
  }

  removeCP(id: string) {
    this.packService.deleteContextPackFromAll(this.login.user.authId, id).subscribe(() => {
      this.contextPacks = this.contextPacks.filter(cp => cp._id !== id);
      this.initValues();
      this.count();
    });
    return id;
  }

  initValues(){
    this.verbCount = 0;
    this.adjectiveCount = 0;
    this.miscCount = 0;
    this.nounCount = 0;
    this.assignedCount = 0;
    this.unAssignedCount = 0;
    this.enabledCount = 0;
    this.disabledCount = 0;
  }

  count() {
    this.contextPacks.forEach(cp => cp.wordlists.forEach(wl => {
      this.nounCount += wl.nouns.length;
      this.verbCount += wl.verbs.length;
      this.adjectiveCount += wl.adjectives.length;
      this.miscCount += wl.misc.length;
    }));
    this.contextPacks.forEach(cp => {
      if (this.learners.some(learner =>
        learner.learnerPacks.some(id => {
          console.log(`cp.id = ${cp._id} and learnerPackId = ${id} so ${cp._id === id}`);
          return cp._id === id;
        }))) {
        this.assignedCount++;
      } else {
        this.unAssignedCount++;
      }
      if(cp.enabled){
        this.enabledCount++;
      } else{
        this.disabledCount++;
      }
    });
  }

}
