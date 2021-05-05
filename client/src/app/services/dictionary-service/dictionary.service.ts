import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  apiUrl = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';
  apiKey = '79a089d4-002b-4bd0-a177-6eae2a531161';

  constructor(private httpClient: HttpClient) { }

  getType(word: string, onLoaded: (type: string) => any, onFailed?: (type: string) => any) {
    return this.httpClient.get<any>(this.generateLink(word)).subscribe(json => {
      const type = json[0].fl;
      onLoaded(type);
    }, error => {
      onFailed(error);
    });
  }
  getForms(word: string, onLoaded: (type: string[]) => any, onFailed?: (type: string) => any) {
    return this.httpClient.get<any>(this.generateLink(word)).subscribe(json => {
      const forms = json[0].meta.stems;
      onLoaded(forms);
    }, error => {
      onFailed(error);
    });
  }
  generateLink(word: string): string {
    return `${this.apiUrl}/${word}?key=${this.apiKey}`;
  }
}
