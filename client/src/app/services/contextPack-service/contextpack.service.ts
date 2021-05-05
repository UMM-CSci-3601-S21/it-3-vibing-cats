import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { ContextPack } from '../../datatypes/contextPacks';


@Injectable({
  providedIn: 'root'
})
export class ContextPackService {
  readonly contextPackUrl: string = environment.apiUrl + 'packs';
  readonly userUrl: string = environment.apiUrl + 'users';


  constructor(private httpClient: HttpClient) { }


  getPacks(): Observable<ContextPack[]> {
    return this.httpClient.get<ContextPack[]>(this.contextPackUrl, {
      params: new HttpParams(),
    });
  }

  getPack(id: string): Observable<ContextPack> {
    return this.httpClient.get<ContextPack>(this.contextPackUrl + '/' + id);
  }

  addPack(newPack: { name: string; icon: string; enabled: boolean; wordlists?: any[] }): Observable<string> {
    return this.httpClient.post<{ id: string }>(this.contextPackUrl, newPack).pipe(map(res => res.id));
  }

  deletePack(id: string): Observable<string> {
    return this.httpClient.delete<{ id: string }>(this.contextPackUrl + '/' + id).pipe(map(res => res.id));
  }

  addNewContextPackToUser(authId: string,
    newPack: { name: string; icon: string; enabled: boolean; wordlists?: any[] } ): Observable<string> {
    return this.httpClient.post<{id: string}>(this.userUrl + '/' + authId + '/' + 'newPack', newPack).pipe(map(res=> res.id));
  }

  getUserPacks(authId: string): Observable<ContextPack[]> {
    return this.httpClient.get<ContextPack[]>(this.userUrl + '/' + authId + '/' + 'packs', {
      params: new HttpParams(),
    });
  }

  getLearnerPacks(authId: string, learnerId: string): Observable<ContextPack[]> {
    return this.httpClient.get<ContextPack[]>(this.userUrl + '/' + authId + '/' + learnerId + '/' + 'learnerPacks', {
      params: new HttpParams(),
    });
  }

  deleteContextPackFromAll(authId: string, cpId: string): Observable<string> {
    return this.httpClient.delete<{id: string}>(this.userUrl + '/' + authId + '/' + cpId).pipe(map(res=>res.id));
  }

}
