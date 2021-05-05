import { LoginService } from 'src/app/services/login-service/login.service';
import { ContextPackService } from 'src/app/services/contextPack-service/contextpack.service';
import { Component, Input, OnInit } from '@angular/core';
import { Learner } from 'src/app/datatypes/learner';
import { ContextPack } from 'src/app/datatypes/contextPacks';

@Component({
  selector: 'app-learner-card',
  templateUrl: './learner-card.component.html',
  styleUrls: ['./learner-card.component.scss']
})
export class LearnerCardComponent implements OnInit {
  @Input() learner: Learner;

  packs: ContextPack[];
  displayed: ContextPack[];

  constructor(private cpService: ContextPackService,private login: LoginService) { }


  ngOnInit(): void {
    this.cpService.getLearnerPacks(this.login.authID,this.learner._id).subscribe(p=>{
      let count = 0;
      this.packs = p;
      this.displayed = p.filter(_=>{
        count++;
        return count <= 5;
      });
    });
  }

}
