import { AngularFireStorage } from '@angular/fire/storage';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AddContextPackComponent } from './add-contextPacks.component';
import { MockCPService } from 'src/testing/context-pack.service.mock';
import { ContextPackService } from '../../services/contextPack-service/contextpack.service';
import { FireStorageMock } from 'src/testing/angular-fire-storage-mock';
import { DisplayWordlistComponent } from 'src/app/wordlists/display-wordlist/display-wordlist.component';
import { FirebaseAuthMock } from 'src/testing/firebase-auth-mock';
import { AngularFireAuth } from '@angular/fire/auth';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginService } from 'src/app/services/login-service/login.service';
import { LoginServiceMock } from 'src/testing/login-service-mock';
import { FileService } from 'src/app/services/file.service';
import { FileServiceMock } from 'src/testing/file-service.mock';

describe('AddCpComponent', () => {
  let addContextPack: AddContextPackComponent;
  let addContextPackForm: FormGroup;
  let fixture: ComponentFixture<AddContextPackComponent>;

  beforeEach(waitForAsync(() => {
     TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'packs/fakeid', component: DisplayWordlistComponent }
        ])
      ],
      declarations: [ AddContextPackComponent ],
      providers: [{ provide: ContextPackService, useValue: new MockCPService() },
        { provide: AngularFireStorage, useValue: new FireStorageMock() },
        { provide: AngularFireAuth, useValue: new FirebaseAuthMock() },
        { provide: LoginService, useValue: new LoginServiceMock({ email: 'biruk@gmail.com',
        password: 'BirukMengistu', uid:'123'}) },
        { provide: FileService, useValue: new FileServiceMock() },
      ]
    })
    .compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContextPackComponent);
    addContextPack = fixture.componentInstance;
    addContextPack.ngOnInit();
    fixture.detectChanges();
    addContextPackForm = addContextPack.addContextPackForm;
    expect(addContextPackForm).toBeDefined();
    expect(addContextPackForm.controls).toBeDefined();
  });

  it('should create', () => {
    expect(addContextPack).toBeTruthy();
    expect(addContextPackForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addContextPackForm.valid).toBeFalsy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = addContextPack.addContextPackForm.controls.name;
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "Iron Man"', () => {
      nameControl.setValue('Iron Man');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail on really long names', () => {
      nameControl.setValue('x'.repeat(100));
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      nameControl.setValue('Spider-Man 2');
      expect(nameControl.valid).toBeTruthy();
    });
  });

  describe('The icon field', () => {
    it('should upload images"', (done) => {
    const mockFile = new File([''], 'filename', { type: 'text/html' });
    const mockEvt = { target: { files: [mockFile] } };
    const mockReader: FileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window as any, 'FileReader').and.returnValue(mockReader);

    addContextPack.onFileAdded(mockEvt as any);
    expect(addContextPack.uploading).toBe(true);
    setTimeout(()=>{expect(addContextPack.uploading).toBe(false); done();}, 150);
    });

    it('Should throw an error upon an error', () => {
      addContextPack.addContextPackForm.controls.name.setValue(null);
      expect(addContextPack.submitForm()).toBeUndefined();
    });
  });
});
