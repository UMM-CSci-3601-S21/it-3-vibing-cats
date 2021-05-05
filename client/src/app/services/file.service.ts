import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private storage: AngularFireStorage) {

   }

  onFileAdded(event, inProgress, onComplete) {

    const file = event.target.files[0];
    const filePath = `${Math.floor(Math.random() * 100000000)}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    inProgress();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(link => {
          onComplete(link);
        });
      })
    ).subscribe();
  }
}
