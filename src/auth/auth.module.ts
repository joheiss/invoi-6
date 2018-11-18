import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {GoodbyeComponent} from './goodbye/goodbye.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from '../shared/shared.module';
import {UsersComponent} from './users/users.component';
import {Action, ActionReducer, MetaReducer} from '@ngrx/store';
import {AuthService} from './services/auth.service';
import {UsersService} from './services';
import {IdState} from './store/reducers';
import {UserDetailsDialogComponent} from './users/user-details-dialog/user-details-dialog.component';
import {UsersBusinessService} from './business-services/users-business.service';
import {StorageModule} from '../storage/storage.module';
import {UsersUiService} from './services/users-ui.service';
import {PasswordChangeDialogComponent} from './password-change-dialog/password-change-dialog.component';

export function clearState(reducer: ActionReducer<IdState>): ActionReducer<IdState> {
  return function(state: IdState, action: Action): IdState {
    if (action.type === '[Id] clear state') {
      state = undefined;
    }
    return reducer(state, action);
  };
}

export const metaIdReducers: MetaReducer<any>[] = [clearState];

@NgModule({
  declarations: [
    LoginComponent,
    GoodbyeComponent,
    UsersComponent,
    UserDetailsDialogComponent,
    PasswordChangeDialogComponent
  ],
  imports: [
    SharedModule,
    AngularFireAuthModule,
    AuthRoutingModule,
    StorageModule
  ],
  providers: [
    AuthService,
    UsersService,
    UsersUiService,
    UsersBusinessService,
  ],
  entryComponents: [
    UserDetailsDialogComponent,
    PasswordChangeDialogComponent
  ]
})
export class AuthModule {}
