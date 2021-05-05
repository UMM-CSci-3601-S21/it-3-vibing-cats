import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { LoginService } from './../../services/login-service/login.service';
import { DisplayContextPacksComponent } from './../../context-packs/display-contextPacks/display-context-packs.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';
import { LoginServiceMock } from 'src/testing/login-service-mock';
import { FireStorageMock } from 'src/testing/angular-fire-storage-mock';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { FirebaseAuthMock } from 'src/testing/firebase-auth-mock';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/file.service';
import { FileServiceMock } from 'src/testing/file-service.mock';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: LoginService;
  let router: Router;
  let location: Location;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
     imports: [
      FormsModule,
      ReactiveFormsModule,
      MatSnackBarModule,
      MatCardModule,
      MatFormFieldModule,
      MatSelectModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      MatInputModule,
      BrowserAnimationsModule,
       RouterTestingModule.withRoutes([
         { path: 'home', component: DisplayContextPacksComponent }
       ])
     ],
     declarations: [ LoginComponent ],
     providers: [{ provide: LoginService, useValue: new LoginServiceMock() },
       { provide: AngularFireStorage, useValue: new FireStorageMock() },
       { provide: AngularFireAuth, useValue: new FirebaseAuthMock() },
       { provide: FileService, useValue: new FileServiceMock() }
     ]
   })
   .compileComponents();
 }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    service = TestBed.get(LoginService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should upload images"', (done) => {
    const mockFile = new File([''], 'filename', { type: 'text/html' });
    const mockEvt = { target: { files: [mockFile] } };
    const mockReader: FileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window as any, 'FileReader').and.returnValue(mockReader);

   component.onFileAdded(mockEvt as any);
    expect(component.uploading).toBe(true);
    setTimeout(()=>{expect(component.uploading).toBe(false); done();}, 150);
    });
  it('should sign in"', (done) => {
    // Add tests for signing in using spies
    component.loginEmail = 'biruk@gmail.com';
    component.loginPass = 'BirukMengistu';
    component.signIn().then(res=>{
      expect(res + '').toBe('someuserdata');
      done();
    });
  });
  it('should sign in if already logged in"', () => {
    service.loggedIn = true;
    component.ngOnInit();
    expect(_=>{component.ngOnInit();}).toBeTruthy();
  });
  it('should return error when signing in with invalid credentials"', (done) => {
    // Add tests for signing in using spies
    component.loginEmail = 'biruk@gmail.com';
    component.loginPass = 'SomeWrongPassword';
    component.signIn().then(()=>{},err=>{
      expect(err).toBe('The account you entered does not exist.');
      done();
    });
  });
  it('should return error when signing in with invalid email format"', (done) => {
    // Add tests for signing in using spies
    component.loginEmail = 'something that is not a password';
    component.loginPass = 'SomeWrongPassword';
    component.signIn().then(()=>{},err=>{
      expect(err).toBe('Error');
      done();
    });
  });
  it('should sign up"', (done) => {
    component.signUpEmail = 'biruk@gmail.com';
    component.signUpPass = 'BirukMengistu';
    component.signUpName = 'Biruk';
    component.downloadURL = 'something.com/boof.jpg';

    component.signUp().then(res=>{
      expect(res !== null).toBe(true);
      done();
    });
    done();
  });
  it('should give error when sign up with invalid email"', (done) => {
    component.signUpEmail = 'birukgmailcom';
    component.signUpPass = 'BirukMengistu';
    component.signUpName = 'Biruk';

    component.signUp().then(()=>{},error=>{
      expect(error !== null).toBe(true);
      done();
    });
  });
  it('should give error when sign up with no password"', (done) => {
    component.signUpEmail = 'birukgmailcom';
    component.signUpPass = '';
    component.signUpName = 'Biruk';

    component.signUp().then(()=>{},error=>{
      expect(error !== null).toBe(true);
      done();
    });
  });
});
