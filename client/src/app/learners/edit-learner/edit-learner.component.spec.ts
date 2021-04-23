import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireStorage } from '@angular/fire/storage';
import { ContextPackService } from 'src/app/services/contextPack-service/contextpack.service';
import { FireStorageMock } from 'src/testing/angular-fire-storage-mock';
import { LoginService } from 'src/app/services/login-service/login.service';
import { MockCPService } from 'src/testing/context-pack.service.mock';
import { LoginServiceMock } from 'src/testing/login-service-mock';
import { EditLearnerComponent } from './edit-learner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/services/user-service/user.service';
import { UserServiceMock } from 'src/testing/user-service-mock';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ContextPack } from 'src/app/datatypes/contextPacks';


describe('EditLearnerComponent', () => {
  let component: EditLearnerComponent;
  let fixture: ComponentFixture<EditLearnerComponent>;
  const paramMap = new Map();
  paramMap.set('id', '123');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
      RouterTestingModule],
      declarations: [ EditLearnerComponent ],
      providers: [{ provide: ContextPackService, useValue: new MockCPService() },
        { provide: UserService, useValue: new UserServiceMock() },
        { provide: LoginService, useValue: new LoginServiceMock({ email: 'biruk@gmail.com',
        password: 'BirukMengistu', uid:'123'}) },
      { provide: AngularFireStorage, useValue: new FireStorageMock() },
      {provide: ActivatedRoute,
        useValue: {
          paramMap: of(paramMap)
        }}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the correct learner', () => {
    expect(component.learner).toBe(UserServiceMock.learners[0]);
  });

  it('should get the correct learner packs', () => {
    expect(component.learnerPacks).toBe(MockCPService.testCPs);
  });

  it('should get the correct user packs', () => {
    expect(component.userPacks).toBe(MockCPService.testCPs);
  });

  // it('should be able to tell if a pack exists', () => {
  // });

  it('should assign a context pack to a learner', () => {
    component.add(MockCPService.testCPs[0]);
    //expect(component.learnerPacks).toBe();
  });

  it('should remove a pack', () => {
    component.remove(MockCPService.testCPs[0]);
    expect(component.learnerPacks).toBe(MockCPService.testCPs.slice(1,2));
  });

  // it('should save changes', () => {
  // });
});
