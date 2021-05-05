import { TestBed } from '@angular/core/testing';
import { AngularFireStorage } from '@angular/fire/storage';
import { FireStorageMock } from 'src/testing/angular-fire-storage-mock';
import { FileServiceMock } from 'src/testing/file-service.mock';

import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{ provide: AngularFireStorage, useValue: new FireStorageMock() },
      {provide: FileService, useValue: new FileServiceMock()}]
    });
    service = TestBed.inject(FileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload images"', (done) => {
    const mockFile = new File([''], 'filename', { type: 'text/html' });
    const mockEvt = { target: { files: [mockFile] } };
    const mockReader: FileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    let uploading = false;
    service.onFileAdded(mockEvt as any, ()=>{uploading = true;},( )=>{uploading = false;});
    expect(uploading).toBe(true);
    setTimeout(()=>{expect(uploading).toBe(false); done();}, 150);
    });
});
