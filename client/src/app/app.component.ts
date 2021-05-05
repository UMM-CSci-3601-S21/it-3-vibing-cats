import { LoginService } from './services/login-service/login.service';
import { ContextPackService } from './services/contextPack-service/contextpack.service';
import { ContextPack } from './datatypes/contextPacks';
import { Router, RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { trigger, transition, style, query, animateChild, animate, group } from '@angular/animations';

const slideInAnimation =
trigger('routeAnimations', [
  transition('HomePage <=> LoginPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', [
      style({ left: '-100%' })
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('1s ease-out', style({ left: '100%',opacity:'0'}))
      ]),
      query(':enter', [
        animate('1s ease-out', style({ left: '0%',opacity:'1' }))
      ])
    ]),
    query(':enter', animateChild()),
  ]),
]);
const fader1 =
  trigger('routeAnimations', [
    transition('LoginPage => HomePage', [
      // Set a default  style for enter and leave
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
          transform: 'scale(0) translateY(100%)',
        }),
      ]),
      // Animate the new page in
      query(':enter', [
        animate('600ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ])
    ]),
]);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fader1
  ]
})
export class AppComponent implements OnInit {
  title = 'WordRiver';
  backButtonVisible = false;
  contextPackVisible = false;
  contextPack: ContextPack;
  loggedIn = false;
  uid: string;
  userName: string;
  icon: string;



  constructor(
    private location: Location,
    private router: Router,
    private service: ContextPackService,
    private login: LoginService
  ) { }

  ngOnInit(): void {
    this.loggedIn = this.login.isLoggedIn;
    this.location.onUrlChange(url => {
      this.backButtonVisible = url !== '/';
      if(/\/packs\/.{24}\/.{2,}/g.test(url)){
        this.service.getPack(url.split('/')[2]).subscribe(pack => {
          this.contextPack = pack;
          this.contextPackVisible = true;
        });
      } else {
        this.contextPackVisible = false;
        this.contextPack = undefined;
      }
      this.initValues();
    });

  }

  initValues() {
    this.loggedIn = this.login.isLoggedIn;
    this.uid = this.login.authID;
    this.userName = this.login.user ? this.login.user.name || '' : '';
    this.icon = this.login.user ? this.login.user.icon|| '' : '';
  }

  goBack() {
    const path = this.location.path();
    if ((/^\/?packs\/new\/?$/g).test(path) || // New Context Pack
      (/^\/?packs\/.{24}\/?$/g).test(path)) { // Display wordlists
      this.router.navigate(['/home']);
    }
    else if (
      (/^\/?packs\/.{24}\/import$/g).test(path) || // Import wordlist
      (/^\/?packs\/.{24}\/new$/g).test(path) ||  // add wordlist
      (/^\/?packs\/.{24}\/.{1,100}$/g).test(path) // view wordlist
    ) {
      this.router.navigate(['packs/' + path.split('/')[2]]);
    } else {
      this.location.back();
    }
  }
  logOut() {
    this.login.signOut(res => {
      console.log(res);
      this.router.navigate(['']);
    }, err => console.log(err));
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
