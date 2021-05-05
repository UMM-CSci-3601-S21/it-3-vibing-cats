import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { COMMON_IMPORTS } from 'src/app/app-routing.module';
import { WordListService } from 'src/app/services/wordlist.service';
import { MockWordListService } from 'src/testing/wordlist.service.mock';
import { DisplayWordlistComponent } from '../display-wordlist/display-wordlist.component';
import { ImportWordlistComponent } from './import-wordlist.component';

describe('ImportWordlistComponent', () => {
  let component: ImportWordlistComponent;
  let fixture: ComponentFixture<ImportWordlistComponent>;
  const paramMap = new Map();

  let ngZone: NgZone;
  paramMap.set('id', 'wow');
  const ex = {
    name: 'testWordlistForImport',
    enabled: true,
    nouns: [{ word: 'pig', forms: ['pig', 'pigs'] }],
    verbs: [{ word: 'sniff', forms: ['sniffs', 'sniffing'] }],
    adjectives: [{ word: 'round', forms: ['rounder', 'round'] }],
    misc: [{ word: 'to', forms: ['to'] }]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportWordlistComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
        { path: 'packs/wow', component: DisplayWordlistComponent }
      ]), COMMON_IMPORTS],
      providers: [{ provide: WordListService, useValue: new MockWordListService() }, {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(paramMap)
        }
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportWordlistComponent);
    component = fixture.componentInstance;
    ngZone = TestBed.get(NgZone);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should import', () => {
    // eslint-disable-next-line max-len
    const mockFile = new File(['{"name":"sad","enabled":true,"nouns":[],"verbs":[],"adjectives":[],"misc":[]}'], 'filename', { type: 'application/json' });
    const mockEvt = { target: { files: [mockFile] } };
    spyOn(window as any, 'FileReader').and.callThrough();
    component.onFileAdded(mockEvt as any);
    expect(window.FileReader).toHaveBeenCalled();
  });
  it('should fail import with array', () => {
    // eslint-disable-next-line max-len
    const mockFile = new File(['[{"name":"sad","enabled":true,"nouns":[],"verbs":[],"adjectives":[],"misc":[]}]'], 'filename', { type: 'application/json' });
    const mockEvt = { target: { files: [mockFile] } };
    spyOn(window as any, 'FileReader').and.callThrough();
    component.onFileAdded(mockEvt as any);
    expect(window.FileReader).toHaveBeenCalled();
  });
  it('should fail import with invalid', () => {
    // eslint-disable-next-line max-len
    const mockFile = new File(['turkey'], 'filename', { type: 'application/json' });
    const mockEvt = { target: { files: [mockFile] } };
    spyOn(window as any, 'FileReader').and.callThrough();
    component.onFileAdded(mockEvt as any);
    expect(window.FileReader).toHaveBeenCalled();
  });

  it('should save', () => {
    component.wordlist = ex;
    component.id = 'wow';
    expect(component.save()).toBe(true);
    component.wordlist = undefined;
    expect(component.save()).toBe(false);
  });
});
