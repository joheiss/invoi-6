import {Injectable} from '@angular/core';
import {UserCredentials} from '../models/user';
import {Observable, of, throwError} from 'rxjs/index';
import {catchError, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {UiService} from '../../shared/services/ui.service';
import {AUTH_MSGS} from '../auth-error-messages';
import {MessageContent, Messages} from '../../shared/models/message.model';
import {FbAuthService} from '../../shared/services/fb-auth.service';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {FbFunctionsService} from '../../shared/services/fb-functions.service';

@Injectable()
export class AuthService {

  messages: Messages;

  constructor(private fbAuth: FbAuthService,
              private fbStore: FbStoreService,
              private fbFunctions: FbFunctionsService,
              private uiService: UiService) {
    this.messages = new Messages(AUTH_MSGS);
  }

  queryAuth(): Observable<any> {
    return this.fbAuth.getAuthState()
      .pipe(
        filter(authData => !!authData),
        switchMap(authData => this.setIdToken(authData)),
        switchMap(authData => this.fbStore.getOneUserProfile(authData.uid)
          .pipe(
            map(userProfile => {
              return {...userProfile.data(), uid: authData.uid};
            }),
            catchError(error => of(error))
          )));
  }

  login(credentials: UserCredentials): Observable<any> {
      return this.fbAuth.signInWithEmailAndPassword(credentials.email, credentials.password)
        .pipe(
          catchError(err => {
            this.uiService.openSnackBar(this.messages.getMessage(err.code));
            throw new Error(err);
          }));
  }

  logout(): Observable<any> {
    return this.fbAuth.logout()
      .pipe(
        tap(() => {
          this.removeIdToken();
          this.uiService.openSnackBar(this.messages.getMessage('user-logged-out'));
        }));
  }

  changeMyPassword(credentials: { uid: string; email?: string; oldPassword?: string, password: string }): Observable<any> {
    return this.fbAuth.changeMyPassword(credentials)
      .pipe(
        catchError(err => throwError(err))
      );
  }

  changePassword(payload: { uid: string, password: string }): Observable<any> {
    return this.fbFunctions.changePassword(payload)
      .pipe(
        catchError((error: any) => throwError(error))
      );
  }

  getMessage(id: string, params?: string[]): MessageContent {
    if (params && params.length > 0) {
      return this.messages.getMessageWithParams(id, params);
    }
    return this.messages.getMessage(id);
  }

  private removeIdToken(): void {
    localStorage.removeItem('id_token');
  }

  setIdToken(authData: any): Observable<any> {
    console.log('***AUTH SET ID TOKEN***');
    return this.fbAuth.getIdToken(authData)
      .pipe(
        take(1),
        tap(idToken => localStorage.setItem('id_token', idToken)),
        map(() => authData)
      );
  }
}
