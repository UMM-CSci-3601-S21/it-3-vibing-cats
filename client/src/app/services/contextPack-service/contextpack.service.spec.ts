import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ContextPack } from '../../datatypes/contextPacks';
import { ContextPackService } from '../contextPack-service/contextpack.service';
import { WordList } from '../../datatypes/wordlist';
import { User } from 'src/app/datatypes/user';

describe('ContextPackService', () => {
  const testList: Array<WordList> = [
    {
      name: 'Langley',
      enabled: true,
      nouns: [
        {
          word: 'Joker',
          forms: [
            'Joker'
          ]
        },
        {
          word: 'villain',
          forms: [
            'villain', 'villains'
          ]
        }
      ],
      verbs: [
        {
          word: 'fly',
          forms: [
            'fly',
            'flown',
            'flew'
          ]
        },
        {
          word: 'dance',
          forms: [
            'dance',
            'danced'
          ]
        },
        {
          word: 'steal',
          forms: [
            'steal',
            'stole'
          ]
        },
        {
          word: 'laugh',
          forms: [
            'laugh',
            'laughed',
            'laughing'
          ]
        },
        {
          word: 'hide',
          forms: [
            'hide',
            'hid',
            'hiding'
          ]
        }
      ],
      adjectives: [
        {
          word: 'evil',
          forms: [
            'evil'
          ]
        },
        {
          word: 'sad',
          forms: [
            'sad'
          ]
        }
      ],
      misc: [
        {
          word: 'the',
          forms: [
            'the'
          ]
        }
      ]
    }
  ];
  const testCPs: ContextPack[] = [
    {
      _id: 'meow',
      schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: 'felines',
      icon: '',
      enabled: false,
      wordlist: testList
    },
    {
      _id: 'woof',
      schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: 'canines',
      icon: '',
      enabled: true,
      wordlist: testList
    },
    {
      _id: 'moo',
      schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: 'bovines',
      icon: '',
      enabled: true,
      wordlist: testList
    }
  ];
  const testUser: User = {
    authId: '12345',
    name: 'John Doe',
    icon: 'image.png',
    learners: [],
    contextPacks: ['meow','woof']
  };
  let service: ContextPackService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ContextPackService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPacks() should call api/packs', fakeAsync(() => {
    service.getPacks().subscribe(
      packs => expect(packs).toBe(testCPs)
    );
    const req = httpTestingController.expectOne(service.contextPackUrl);
    expect(req.request.method).toEqual('GET');
  }));

  it('getPackById() calls api/packs/id', () => {
    const targetPack: ContextPack= testCPs[1];
    const targetId: string = targetPack._id;

    service.getPack(targetId).subscribe(
      pack => expect(pack).toBe(targetPack)
    );

    const req = httpTestingController.expectOne(service.contextPackUrl + '/' + targetId);
    expect(req.request.method).toEqual('GET');
  });

  it('addPack() posts to api/packs', () => {
    service.addPack(testCPs[2]).subscribe(
      id => expect(id).toBe('test')
    );

    const req = httpTestingController.expectOne(service.contextPackUrl);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testCPs[2]);

    req.flush({id: 'test'});
  });


it('deletePack calls api/packs/:id', () => {
  service.deletePack(testCPs[2]._id).subscribe(
    id => expect(id).toBe('moo')
  );
  const req = httpTestingController.expectOne(service.contextPackUrl + '/' + testCPs[2]._id);
  expect(req.request.method).toEqual('DELETE');
  req.flush({id: 'moo'});
});

it('addNewContextPackToUser posts to api/users/:authId', () => {
  service.addNewContextPackToUser('12345', testCPs[2]).subscribe(
    id => expect(id).toBe('test'));

    const req = httpTestingController.expectOne(service.userUrl + '/12345/newPack');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testCPs[2]);

    req.flush({id: 'test'});
});

it('getUserPacks gets from /api/users/:authId/packs', () => {
  service.getUserPacks('12345').subscribe();

  const req = httpTestingController.expectOne(service.userUrl + '/12345/packs');
  expect(req.request.method).toEqual('GET');
});

it('getLearnerPacks gets from /api/users/:authId/:learnerId', () => {
  service.getLearnerPacks('12345', 'IamALearner').subscribe();

  const req = httpTestingController.expectOne(service.userUrl + '/12345/IamALearner/learnerPacks');
  expect(req.request.method).toEqual('GET');
});

it('deleteContextPackFromAll calls api/users/:authId/:cpId', () => {
  service.deleteContextPackFromAll('12345',testCPs[2]._id).subscribe(
    id => expect(id).toBe('moo')
  );
  const req = httpTestingController.expectOne(service.userUrl + '/12345/' + testCPs[2]._id);
  expect(req.request.method).toEqual('DELETE');
  req.flush({id: 'moo'});
});


});
