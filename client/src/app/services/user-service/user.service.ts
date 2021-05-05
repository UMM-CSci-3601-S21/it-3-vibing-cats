import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/datatypes/user';
import { Learner } from 'src/app/datatypes/learner';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly userUrl: string = environment.apiUrl + 'users';

  constructor(private httpClient: HttpClient) { }

  getUser(authId: string): Observable<User> {
    return this.httpClient.get<User>(this.userUrl + '/' + authId);
  }

  createUser(newUser: User): Observable<string> {
    return this.httpClient.post<{id: string}>(this.userUrl, newUser).pipe(map(res=>res.id));
  }

  createLearner(authId: string, newLearner: Learner): Observable<string> {
    return this.httpClient.post<{id: string}>(this.userUrl + '/' + authId, newLearner).pipe(map(res=>res.id));
  }

  getLearners(authId: string): Observable<Learner[]> {
    return this.httpClient.get<Learner[]>(this.userUrl + '/' + authId + '/' + 'learners', {
      params: new HttpParams(),
    });
  }

  getLearner(authId: string, learnerId: string): Observable<Learner> {
    return this.httpClient.get<Learner>(this.userUrl + '/' + authId + '/' + learnerId);
  }

  editLearner(authId: string, learnerId: string, editedLearner: Learner): Observable<Learner> {
    return this.httpClient.put<Learner>(this.userUrl + '/' + authId + '/' + learnerId, editedLearner).pipe(map(res=>res));
  }

  removePackFromLearner(authId: string, learnerId: string, packId: string): Observable<string> {
    return this.httpClient.delete<{id: string}>(this.userUrl + '/' + authId + '/' + learnerId + '/' + packId).pipe(map(res=>res.id));
  }

  addPackToLearner(authId: string, learnerId: string, packId: string): Observable<string> {
    return this.httpClient.put<{id: string}>(this.userUrl + '/' + authId + '/' + learnerId + '/' + packId, packId).pipe(map(res=>res.id));
  }

  removeLearner(authId: string, learnerId: string): Observable<string> {
    return this.httpClient.delete<{id: string}>(this.userUrl + '/' + authId + '/' + learnerId + '/learners').pipe(map(res=>res.id));
  }

}
