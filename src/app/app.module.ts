  import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import localeDE from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {Action, ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from '../shared/shared.module';
import {StorageModule} from '../storage/storage.module';
import {AuthModule} from '../auth/auth.module';

import {environment} from '../environments/environment';

import {AppComponent} from './containers/app.component';
import {HomeComponent} from './home/home.component';
import {TestComponent} from './test/test.component';
import {LoadComponent} from './load/load.component';
import {NaviHeaderComponent} from './containers/navigation/navi-header/navi-header.component';
import {NaviSidebarComponent} from './containers/navigation/navi-sidebar/navi-sidebar.component';

import {CustomSerializer, reducers, rootEffects} from './store';
import * as fromGuards from '../auth/guards';
import {AppState} from './store/reducers';
import {authEffects} from '../auth/store/effects';
import {storageEffects} from '../storage/store/effects';

// -- not used in production
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {storeFreeze} from 'ngrx-store-freeze';

export function clearState(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state: AppState, action: Action): AppState {
    if (action.type === '[Auth] clear state') {
      console.log('CLEAR STATE CALLED.');
        state = undefined;
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = !environment.production ? [clearState, storeFreeze] : [clearState];

registerLocaleData(localeDE);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestComponent,
    LoadComponent,
    NaviHeaderComponent,
    NaviSidebarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    SharedModule,
    AuthModule,
    StorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), /*, 'jovisco-invoicing'), */
    AngularFirestoreModule.enablePersistence(),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([...rootEffects, ...authEffects, ...storageEffects]),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' },
    {
      provide: RouterStateSerializer,
      useClass: CustomSerializer
    },
    ...fromGuards.guards,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
