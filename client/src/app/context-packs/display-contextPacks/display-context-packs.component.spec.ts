import { UserServiceMock } from './../../../testing/user-service-mock';
import { UserService } from './../../services/user-service/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from './../../../environments/environment';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { DisplayContextPacksComponent } from '../../context-packs/display-contextPacks/display-context-packs.component';
import { ContextPackCardComponent } from '../../context-packs/contextPack-card/context-pack-card.component';
import { MockCPService } from 'src/testing/context-pack.service.mock';
import { ContextPackService } from '../../services/contextPack-service/contextpack.service';
import { ContextPack } from '../../datatypes/contextPacks';
import { AngularFireModule } from '@angular/fire';
import { LoginServiceMock } from 'src/testing/login-service-mock';
import { LoginService } from 'src/app/services/login-service/login.service';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFireAuthModule,
  HttpClientTestingModule
];

describe('Display Context-Packs component', () => {
  let dpContextPacks: DisplayContextPacksComponent;
  let fixture: ComponentFixture<DisplayContextPacksComponent>;
  let loginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [DisplayContextPacksComponent, ContextPackCardComponent],
      providers: [{ provide: ContextPackService, useValue: new MockCPService() },
        { provide: UserService, useValue: new UserServiceMock() },
      {
        provide: LoginService, useValue: new LoginServiceMock({
          email: 'biruk@gmail.com',
          password: 'BirukMengistu', uid: '123'
        })
      }, { provide: UserService, useValue: new UserServiceMock() },]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DisplayContextPacksComponent);
      dpContextPacks = fixture.componentInstance;
      fixture.detectChanges();
      dpContextPacks.ngOnInit();
    });
  }));

  it('contains all the packs', () => {
    expect(dpContextPacks.contextPacks.length).toBe(2);
  });

  it('should delete a context pack and then have 1 fewer context pack', () => {
    dpContextPacks.contextPacks.push({
      _id: 'panda',
      schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: 'Pandas',
      icon: 'panda.png',
      enabled: false,
      wordlist: MockCPService.testList,
    });
    const idToDelete = 'panda';
    expect(dpContextPacks.contextPacks.length).toBe(3);
    dpContextPacks.removeCP(idToDelete);
    expect(dpContextPacks.contextPacks.length).toBe(2);
  });

  it('contains a pack named "canines"', () => {
    expect(dpContextPacks.contextPacks.some((pack: ContextPack) => pack.name === 'canines')).toBe(true);
  });

  it('contains two packs that are enabled', () => {
    expect(dpContextPacks.contextPacks.filter((pack: ContextPack) => pack.enabled === true).length).toBe(1);
  });

  it('Contains a pack whose icon is "https://can-do-canines.org/wp-content/uploads/2018/01/admin-ajax.jpg"', () => {
    expect(dpContextPacks.contextPacks.some((pack: ContextPack) =>
      pack.icon === 'https://can-do-canines.org/wp-content/uploads/2018/01/admin-ajax.jpg')).toBe(true);
  });

  it('should create', () => {
    expect(dpContextPacks).toBeTruthy();
  });

  it('should count', (done) => {
    dpContextPacks.getPacksFromServer();
    setTimeout(done, 2000);
    expect(dpContextPacks.adjectiveCount).toBe(4);
    expect(dpContextPacks.verbCount).toBe(10);
    expect(dpContextPacks.nounCount).toBe(4);
    expect(dpContextPacks.miscCount).toBe(2);
    expect(dpContextPacks.assignedCount).toBe(1);
    expect(dpContextPacks.unAssignedCount).toBe(1);
    expect(dpContextPacks.enabledCount).toBe(1);
    expect(dpContextPacks.disabledCount).toBe(1);
  });

});

describe('Misbehaving Context Pack List', () => {
  let dpContextPacks: DisplayContextPacksComponent;
  let fixture: ComponentFixture<DisplayContextPacksComponent>;
  let cpServiceStub: {
    getUserPacks: () => Observable<ContextPack[]>;
  };

  beforeEach(() => {
    // Stub Context-Pack service for test purposes
    cpServiceStub = {
      getUserPacks: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [DisplayContextPacksComponent],
      providers: [{ provide: ContextPackService, useValue: cpServiceStub },
      { provide: UserService, useValue: new UserServiceMock() },
      {
        provide: LoginService, useValue: new LoginServiceMock({
          email: 'biruk@gmail.com',
          password: 'BirukMengistu', uid: '123'
        })
      }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DisplayContextPacksComponent);
      dpContextPacks = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a ContextPackService', () => {
    expect(dpContextPacks.contextPacks).toBeUndefined();
  });

});

