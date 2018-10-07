import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UserData} from '../../auth/models/user';

@Injectable()
export class FbFunctionsService {

  constructor(private http: HttpClient) {
  }

  /* --- users --- */
  changePassword(payload: { uid: string, password: string }): Observable<any> {
    const url = `${environment.cloudFunctionsURL}/users/${payload.uid}`;
    return this.http.post<any>(url, payload);
  }

  createOneUser(payload: { user: UserData, password: string }): Observable<UserData> {
    const url = `${environment.cloudFunctionsURL}/users/new`;
    return this.http.post<any>(url, payload);
  }

  updateOneUser(payload: { user: UserData, password: string }): Observable<UserData> {
    const url = `${environment.cloudFunctionsURL}/users/${payload.user.uid}`;
    return this.http.post<any>(url, payload);
  }
}
