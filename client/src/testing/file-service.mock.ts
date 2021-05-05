
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { FileService } from 'src/app/services/file.service';

@Injectable()
export class FileServiceMock extends FileService {
  constructor() {
    super(null);
  }

  onFileAdded(event, inProgress, onComplete){
    inProgress();
    setTimeout(()=>{onComplete();}, 100);
  }
}
