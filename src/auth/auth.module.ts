import {ModuleWithProviders, NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {GoodbyeComponent} from './goodbye/goodbye.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from '../shared/shared.module';
import {UsersComponent} from './users/users.component';
import {Action, ActionReducer, MetaReducer} from '@ngrx/store';
import {IdState} from './store/reducers';
import {UserDetailsDialogComponent} from './users/user-details-dialog/user-details-dialog.component';
import {StorageModule} from '../storage/storage.module';
import {PasswordChangeDialogComponent} from './password-change-dialog/password-change-dialog.component';
import {IfAuthorizedForSalesDirective} from './directives/if-authorized-for-sales.directive';
import {IfAuthorizedForAdminDirective} from './directives/if-authorized-for-admin.directive';
import {services} from './services';
import {businessServices} from './business-services';
import {guards} from './guards';
import {IfAuthorizedAsDirective} from '../shared/directives/if-authorized-as.directive';
import {IfAuthorizedForSalesEditDirective} from './directives/if-authorized-for-sales-edit.directive';

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
    PasswordChangeDialogComponent,
    IfAuthorizedForSalesDirective,
    IfAuthorizedForSalesEditDirective,
    IfAuthorizedForAdminDirective
  ],
  imports: [
    SharedModule,
    AngularFireAuthModule,
    StorageModule,
    AuthRoutingModule
  ],
  providers: [
    ...businessServices,
    ...services,
    ...guards
  ],
  entryComponents: [
    UserDetailsDialogComponent,
    PasswordChangeDialogComponent
  ],
  exports: [
    LoginComponent,
    GoodbyeComponent,
    UsersComponent,
    UserDetailsDialogComponent,
    PasswordChangeDialogComponent,
    IfAuthorizedForSalesDirective,
    IfAuthorizedForSalesEditDirective,
    IfAuthorizedForAdminDirective
    ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        ...businessServices,
        ...services,
        ...guards
      ]
    };
  }
}
