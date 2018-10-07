import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import * as fromStore from '../store';
import * as fromAuth from '../../auth/store';
import * as fromStorage from '../../storage/store';
import {select, Store} from '@ngrx/store';
import {User, UserData, UserProfileData} from '../models/user';
import {UploadPopupData} from '../../storage/models/upload-popup-data';
import {first, tap} from 'rxjs/operators';


@Injectable()
export class UsersBusinessService {

  private static template: UserData = {
    uid: null,
    email: null,
    organization: null,
    roles: null,
    displayName: null,
    isLocked: false
  };

  private auth: UserData | null;

  constructor(private store: Store<fromStore.IdState>) {
    this.store.pipe(
      select(fromAuth.selectAuth),
      first(),
      tap(auth => this.auth = auth)
    )
      .subscribe();
  }

  getAllUsers(): Observable<User[]> {
    return this.store.pipe(select(fromStore.selectAllUsersAsObjArray));
  }

  getCurrent(): Observable<User> {
    return this.store.pipe(select(fromStore.selectCurrentUserAsObj));
  }

  changePassword(credentials: { uid: string, email?: string, oldPassword?: string, password: string }) {
    if (this.auth.uid === credentials.uid) {
      this.store.dispatch(new fromStore.ChangeMyPassword(credentials));
    } else {
      this.store.dispatch(new fromStore.ChangePassword({ uid: credentials.uid, password: credentials.password}));
    }

  }

  create(userAndPassword: { user: User, password: string }) {
    const payload = {
      user: userAndPassword.user.data,
      password: userAndPassword.password
    };
    this.store.dispatch(new fromStore.CreateUser(payload));
  }

  deleteProfileImage(user: User) {
    const filePath = this.getImagePathFromUrl(user.imageUrl);
    this.store.dispatch(new fromStorage.DeleteFile(filePath));
    const {imageUrl: ignore, ...data} = user.data;
    const payload = {user: {imageUrl: null, ...data}, password: null};
    this.store.dispatch(new fromStore.UpdateUser(payload));
  }

  getThumbnailUrlForSize(url: string, size: string): string {
    if (!url) {
      return null;
    }
    const endOfSize = url.lastIndexOf('_thumb.png');
    let startOfSize = url.substring(endOfSize - 5, endOfSize).lastIndexOf('_');
    startOfSize = (endOfSize - 5) + startOfSize + 1;
    return url.substring(0, startOfSize) + size + url.substring(endOfSize);
  }

  new(): UserData {
    return Object.assign({}, UsersBusinessService.template);
  }

  query(): void {
    return this.store.dispatch(new fromStore.QueryUsers());
  }

  select(): Observable<UserData> {
    return this.store.pipe(select(fromStore.selectSelectedUser));
  }

  update(userAndPassword: { user: User, password: string }) {
    const payload = {
      user: userAndPassword.user.data,
      password: userAndPassword.password
    };
    this.store.dispatch(new fromStore.UpdateUser(payload));
  }

  updateProfile(user: User) {
    const payload: UserProfileData = user.data;
    this.store.dispatch(new fromStore.UpdateUserProfile(payload));
  }

  uploadProfileImage(user: UserData) {
    const payload: UploadPopupData = {
      title: 'Profilbild hochladen',
      selectButtonCaption: 'Bild auswählen',
      filePath: `images/users/${user.uid}`
    };
    this.store.dispatch(new fromStorage.UploadImage(payload));
  }

  private getImagePathFromUrl(url: string): string {
    const startOfPath = url.indexOf('images/users/');
    return url.substring(startOfPath);
  }
}
