import { Observable } from 'rxjs';
export class FireStorageMock{
  public ref(filepath){
    return new Ref();
  }
  public upload(s,x): AngularFireUploadTask{
    return new AngularFireUploadTask();
  }
}
export class Ref{
  // getDownloadURL(){
  //   return Observable.create(obs=>{
  //     obs.next('cat.jpg');
  //   });
  // }
}
export class AngularFireUploadTask{
  snapshotChanges(){
    return Observable.create(obs=>{
      obs.next('cat.jpg');
    });
  }
}
export class Task{
  // snapshotChanges(){
  // }
}
