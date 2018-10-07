import {Injectable} from '@angular/core';
import {DocumentChangeAction} from 'angularfire2/firestore';
import {UserData, UserProfileData} from '../models/user';
import {Observable, throwError} from 'rxjs/index';
import {catchError, map} from 'rxjs/operators';
import {AUTH_MSGS} from '../auth-error-messages';
import {MessageContent, Messages} from '../../shared/models/message.model';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {FbFunctionsService} from '../../shared/services/fb-functions.service';

@Injectable()
export class UsersService {

  messages: Messages;

  constructor(private fbStore: FbStoreService,
              private fbFunctions: FbFunctionsService) {
    this.messages = new Messages(AUTH_MSGS);
  }

  queryAll(): Observable<DocumentChangeAction<any>[]> {
    return this.fbStore.queryAllUsers()
      .pipe(
        catchError(() => [])
      );
  }

  queryOne(uid: string): Observable<DocumentChangeAction<any>[]> {
    return this.fbStore.queryOneUser(uid)
      .pipe(
        map(actions => actions.filter(action => action.payload.doc.id === uid)),
        catchError(() => [])
      );
  }

  create(payload: { user: UserData, password: string }): Observable<UserData> {
    return this.fbFunctions.createOneUser(payload)
      .pipe(
        catchError((error: any) => throwError(error))
      );
  }

  delete(payload: UserData): Observable<any> {
    return this.fbStore.deleteOneUser(payload)
      .pipe(
        catchError((error: any) => throwError(error))
      );
  }

  update(payload: { user: UserData, password: string }): Observable<UserData> {
    return this.fbFunctions.updateOneUser(payload)
      .pipe(
        catchError((error: any) => throwError(error))
      );
  }

  updateProfile(payload: UserProfileData): Observable<any> {
    return this.fbStore.updateOneUserProfile(payload)
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

}
