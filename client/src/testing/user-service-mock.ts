/* eslint-disable max-len */
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Learner } from 'src/app/datatypes/learner';
import { User } from 'src/app/datatypes/user';


@Injectable()
export class UserServiceMock {

  learners: Learner[] = [
    {
      _id: '123',
      name: 'George',
      icon: 'image.jpg',
      learnerPacks: ['meow', 'fungi']
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

  users: User[] = [
    {
      _id: 'test',
      authId: '12345',
      name: 'John Doe',
      icon: 'image.png',
      learners: this.learners,
      contextPacks: ['meow', 'woof', 'moo']
    },
    {
      _id: 'test1',
      authId: '123',
      name: 'Danny Doe',
      icon: 'image.png',
      learners: this.learners,
      contextPacks: ['moo', 'woof']
    },
    {
      _id: 'test2',
      authId: '42021',
      name: 'Matt Doe',
      icon: 'image.png',
      learners: [],
      contextPacks: ['bark', 'woof']
    },
  ];

  constructor() {

  }
  getUser(authId: string): Observable<User> {
    return of(this.users.find(user => user.authId === authId));
  }

  createUser(newUser: User): Observable<string> {
    this.users.push(newUser);
    return of('1234');
  }

  createLearner(authId: string, newLearner: Learner): Observable<string> {
    this.learners.push(newLearner);
    return new Observable(sub => {
      if (newLearner.name !== null) { sub.next('err'); }
      else { sub.error(authId); }
    });
  }

  getLearners(authId: string): Observable<Learner[]> {
    return of(this.learners);
  }

  getLearner(authId: string, learnerId: string): Observable<Learner> {
    return of(this.learners.find(l => l._id === learnerId));
  }

  editLearner(authId: string, learnerId: string, editedLearner: Learner): Observable<Learner> {
    this.learners = this.learners.map(learner => learner._id === learnerId ? editedLearner : learner);
    return of(editedLearner);
  }

  removeLearner(authId: string, learnerId: string): Observable<string> {
    console.log(this.users);
    this.users = this.users.map(user =>
      user.authId === authId ?
        user.learners.filter(learner => learner._id !== learnerId) : user) as User[];
    return of(learnerId);
  }

  // removePackFromLearner(authId: string, learnerId: string, packId: string): Observable<string> {
  //   this.learners = this.learners.map(learner => learner._id === learnerId ? learner.learnerPacks.filter(
  //     l => l !== packId
  //   ) : learner) as Learner[];
  //   return of(packId);
  // }

  // addPackToLearner(authId: string, learnerId: string, packId: string): Observable<string> {
  //   // this.learners = this.learners.map(learner => learner._id === learnerId ?
  //   //   learner.learnerPacks.concat : learner) as Learner[];
  //   return of(packId);
  // }

}
