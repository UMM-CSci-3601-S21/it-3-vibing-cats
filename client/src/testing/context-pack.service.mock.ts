import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContextPack } from 'src/app/datatypes/contextPacks';
import { Learner } from 'src/app/datatypes/learner';
import { User } from 'src/app/datatypes/user';
import { WordList } from 'src/app/datatypes/wordlist';
import { ContextPackService } from 'src/app/services/contextPack-service/contextpack.service';

@Injectable()
export class MockCPService extends ContextPackService {
    static testList: Array<WordList> = [{
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
            'villain, villains'
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
    static testCPs: ContextPack[] = [
        {
            _id: 'meow',
            schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
            name: 'felines',
            icon: 'image.png',
            enabled: false,
            wordlist: MockCPService.testList,
            wordlists: MockCPService.testList,
        },
        {
            _id: 'woof',
            schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
            name: 'canines',
            icon: 'https://can-do-canines.org/wp-content/uploads/2018/01/admin-ajax.jpg',
            enabled: true,
            wordlist: MockCPService.testList,
            wordlists: MockCPService.testList,
        },
        {
            _id: 'moo',
            schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
            name: 'bovines',
            icon: 'image.png',
            enabled: true,
            wordlist: MockCPService.testList,
            wordlists: MockCPService.testList,
        }
    ];

    static learners: Learner[] = [
      {
        _id: '123',
        name: 'George',
        icon: 'image.jpg',
        learnerPacks: ['meow', 'woof', 'moo']
      },
      {
        _id: '345',
        name: 'Steve',
        icon: 'image.jpg',
        learnerPacks: ['football', 'soccer']
      },
      {
        _id: '678',
        name: 'Peter',
        icon: 'image.jpg',
        learnerPacks: ['bananas', 'apples']
      }
    ];

     testUser: User = {
      authId: '12345',
      name: 'John Doe',
      icon: 'image.png',
      learners: [],
      contextPacks: ['meow','woof']
    };

    constructor() {
      super(null);
    }

    // This method is no longer used
    // getPacks(): Observable<ContextPack[]> {
    //     return of(MockCPService.testCPs);
    // }
    getPack(id: string): Observable<ContextPack>{
      return of(MockCPService.testCPs[0]);
    }

    deletePack(id: string): Observable<string>{
      MockCPService.testCPs= MockCPService.testCPs.filter(cp=> cp._id!==id);
      return of(id);
    }
    addPack(newPack: { name: string; icon: string; enabled: boolean; wordlists?: any[] }): Observable<string> {
      return of('fakeid');
    }
    includes(cp: ContextPack){
      return MockCPService.testCPs.some(e=>e._id === cp._id);
    }

    addNewContextPackToUser(authId: string,
      newPack: { name: string; icon: string; enabled: boolean; wordlists?: any[] } ): Observable<string> {
       return new Observable(sub=>{
        if(newPack.name){sub.next('fakeid');}
        else {sub.error('Error');}
      });
    }
    getUserPacks(authId: string): Observable<ContextPack[]> {
      const thePacks: ContextPack[] = [];
      thePacks.push(MockCPService.testCPs[0]);
      thePacks.push(MockCPService.testCPs[1]);
      return of(thePacks);
    }

    getLearnerPacks(authId: string, learnerId: string): Observable<ContextPack[]> {
      return of(MockCPService.testCPs);
    }

    deleteContextPackFromAll(authId: string, cpId: string): Observable<string> {
      MockCPService.testCPs= MockCPService.testCPs.filter(cp=> cp._id!==cpId);
      return of(cpId);
    }
}
