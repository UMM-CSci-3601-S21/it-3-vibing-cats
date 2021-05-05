import { UserServiceMock } from './../../../testing/user-service-mock';
import { UserService } from './../user-service/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed} from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { FirebaseAuthMock } from 'src/testing/firebase-auth-mock';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  const john = { name: 'john', email: 'asg@aqega.ags', password: 'sagasgasg', authId: '123' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
      ], providers: [{ provide: AngularFireAuth, useValue: new FirebaseAuthMock() },
      { provide: UserService, useValue: new UserServiceMock() }
      ]
    });

    service = TestBed.inject(LoginService);
  });

  it('should be created', (done) => {
    service.afAuth.authState.subscribe(res => {
      expect(res !== null).toBe(true);
      done();
    });
    expect(service).toBeTruthy();
  });
  it('saveUserData works', () => {
    service.setUserData(john);
    expect(localStorage.getItem('user')).toBeTruthy();
  });
  it('setLoggedIn works', () => {
    service.loggedIn = true;
    expect(service.signedIn).toBe(true);
    service.loggedIn = false;
    expect(service.signedIn).toBe(false);

  });
  it('getAuthID works', () => {
    service.setUserData(john);

    expect(service.authID).toBe('123');
  });

  it('convertMessage works', () => {
    const l = {
      'auth/email-already-in-use': 'The email you entered is already in use.',
      'auth/invalid-email': 'The email you entered is invalid.',
      'auth/weak-password': 'Your password must be at least 6 characters long.',
      'auth/argument-error': 'Please enter a valid email and password first.',
      'auth/user-not-found': 'The account you entered does not exist.',
      'auth/wrong-password': 'Password is incorrect.',
      'misc/error': 'misc/error'
    };
    Object.keys(l).forEach(k =>
      expect(l[k]).toEqual(service.convertMessage(k)));
  });

  it('signUp works', (done) => {
    service.signUp('fs', 'fa.fa', 'faf@ga.ag', 'fadge', res => {
      expect(res).toEqual({ user: { uid: '123' } });
      done();
    }, err => { });
    service.signUp('saf', 'asf', 'asf', '', res => {
    }, err => {
      expect(err).toBe('Error');
      done();
    });
  });

  it('signIn works', (done) => {
    service.signIn('faf@ga.ag', 'fadge', res => {
      expect(res).toEqual({ user: { uid: '1234' } });
      done();
    }, err => {});
    service.signIn('', '', res => {
    }, err => {
      expect(err).toBeUndefined();
      done();
    });
  });
  it('signIn works', (done) => {
    service.signIn('faf@ga.ag', 'fadge', res => {
      expect(res).toEqual({ user: { uid: '1234' } });
      done();
    }, err => {});
    service.signIn('', '', res => {
    }, err => {
      expect(err).toBeUndefined();
      done();
    });
  });

  it('should return null when the user doesnt exist', (done) => {
    service.signOut(_ => {expect(service.authID).toBe(null); done();}, _ => {});
  });
});
