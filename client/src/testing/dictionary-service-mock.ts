import { DictionaryService } from './../app/services/dictionary-service/dictionary.service';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockDictionaryService extends DictionaryService {
  words = {tuna:'noun',run:'verb', the: 'misc'};
  forms = {tuna:['Tunas','Tunae'],bears:['bear','bearing'], the:['the']};

  constructor() {
    super(null);
  }


  getType(word: string, onLoaded: (type: string) => any, onFailed?: (type: string) => any) {
    const val = this.words[word];
    if(val === undefined){
      onFailed('Not found');
      return of('404').subscribe();
    } else {
      onLoaded(val);
      return of(val).subscribe();
    }
  }

  getForms(word: string, onLoaded: (type: string[]) => any, onFailed?: (type: string) => any) {
    const val = this.forms[word];
    if(val === undefined){
      onFailed('Not found');
      return of('404').subscribe();
    } else {
      onLoaded(val);
      return of(val).subscribe();
    }
  }

  // generateLink(word: string): string {
  //   return `www.totallynotadictionary.com/${word}?key=${this.apiKey}`;
  // }

}


