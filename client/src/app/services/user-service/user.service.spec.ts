import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { FirebaseAuthMock } from 'src/testing/firebase-auth-mock';
import { User } from 'src/app/datatypes/user';
import { Learner } from 'src/app/datatypes/learner';
import { ContextPack } from '../../datatypes/contextPacks';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
describe('UserService', () => {
  let service: UserService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const testUser: User = {
    _id: 'test',
    authId: '12345',
    name: 'John Doe',
    icon: 'image.png',
    learners: [],
    contextPacks: ['meow','woof']
  };
  const testLearner: Learner = {
    _id: '123',
    name: 'George',
    icon: 'image.jpg',
    learnerPacks: ['plants', 'fungi']
  };
  const testCP: ContextPack =
    {
      _id: 'meow',
      schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: 'felines',
      icon: '',
      enabled: false,
      wordlist: []
    };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        // RouterTestingModule.withRoutes([
        //   {path:'packs/new',component:AddContextPackComponent},]),
      ],providers:[{ provide: AngularFireAuth, useValue: new FirebaseAuthMock() }]
    });
    // httpClient = TestBed.inject(HttpClient);
    // httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('getUser calls api/users/:id', () => {
    service.getUser(testUser.authId).subscribe(user=>expect(user).toBe(testUser));
    const req = httpTestingController.expectOne(service.userUrl + '/' + testUser.authId);
    expect(req.request.method).toEqual('GET');
  });
  it('createUser posts to api/users', () => {
    service.createUser(testUser).subscribe(id=>expect(id).toBe('test'));
    const req = httpTestingController.expectOne(service.userUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testUser);
    req.flush({id: 'test'});
  });
  it('createLearner should post to api/users/:id', () => {
    service.createLearner(testUser.authId, testLearner).subscribe(id=>expect(id).toBe(testLearner._id));
    const req = httpTestingController.expectOne(service.userUrl + '/' + testUser.authId);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testLearner);
    req.flush({id: '123'});
  });
  it('getLearner calls api/users/:id/:learnerId', () => {
    service.getLearner(testUser.authId, testLearner._id).subscribe(learner => expect(learner).toBe(testLearner));
    const req = httpTestingController.expectOne(service.userUrl + '/' + testUser.authId + '/' + testLearner._id);
    expect(req.request.method).toEqual('GET');
  });
  it('getLearners calls api/users/:id/learners', () => {
    service.getLearners(testUser.authId).subscribe(learners=>expect(learners).toBe(testUser.learners));
    const req = httpTestingController.expectOne(service.userUrl + '/' + testUser.authId + '/learners');
    expect(req.request.method).toEqual('GET');
  });
  it('editLearner calls api/users/:id/:learnerId', () => {
    service.editLearner(testUser.authId, testLearner._id, testLearner).subscribe(learner=>expect(learner).toBe(testLearner));
    const req = httpTestingController.expectOne(service.userUrl + '/' + testUser.authId + '/' + testLearner._id);
    expect(req.request.method).toBe('PUT');
    req.flush(testLearner);
  });
  it('removePackFromLearner calls api/users/:id/:learnerId/:packId', () => {
    service.removePackFromLearner(testUser.authId, testLearner._id, testCP._id).subscribe(id => expect(id).toBe(testCP._id));
    const req = httpTestingController.expectOne(service.userUrl + '/' + testUser.authId + '/' + testLearner._id + '/' + testCP._id);
    expect(req.request.method).toBe('DELETE');
    req.flush({id: 'meow'});
  });
  it('addPackToLearner calls api/users/:id/:learnerId/:packId', () => {
    service.addPackToLearner(testUser.authId, testLearner._id, testCP._id).subscribe(id=>expect(id).toBe(testUser._id));
    const req = httpTestingController.expectOne(service.userUrl + '/' + testUser.authId + '/' + testLearner._id + '/' + testCP._id);
    expect(req.request.body).toBe(testCP._id);
    expect(req.request.method).toBe('PUT');
    req.flush({id: 'test'});
  });
  it('removeLearner calls api/users/:id/:learnerId/learners', () => {
    service.removeLearner(testUser.authId, testLearner._id).subscribe(id=>expect(id).toBe(testLearner._id));
    const req = httpTestingController.expectOne(service.userUrl + '/' + testUser.authId + '/' + testLearner._id + '/learners');
    expect(req.request.method).toBe('DELETE');
    req.flush({id: '123'});
  });
});
