import { of } from 'rxjs';
import { Observable } from 'rxjs';

export class FirebaseAuthMock {

  // auth = Observable.create(obs => {
  //   const john = { name: 'john', email: 'asg@aqega.ags', password: 'sagasgasg', uid: '123' };
  //   obs.next(john);
  // });
  authState=new Observable((obs) => {
    const john = { name: 'john', email: 'asg@aqega.ags', password: 'sagasgasg', uid: '123' };
    obs.next(john);
  });
  createUserWithEmailAndPassword(email, password){
    type Result = {user: {uid: string}};
    return new Promise<Result>((resolve,reject)=>{
      if(email.length !== 0){resolve({user:{uid:'123'}});}
      else {reject('Error');}
    });
  }
  signInWithEmailAndPassword(email, password){
    type Result = {user: {uid: string}};
    return new Promise<Result>((resolve,reject)=>{
      if(email.length !== 0){resolve({user:{uid:'1234'}});}
      else {reject('Error');}
    });
  }

  // Sign out
  signOut(then: (res) => any, err: (some) => any) {
    return of(()=>{}).toPromise();
}
}
