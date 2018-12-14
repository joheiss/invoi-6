import {NgModule} from '@angular/core';
import {Action, ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {SharedModule} from '../shared/shared.module';
import {StorageModule} from '../storage/storage.module';
import {InvoicingRoutingModule} from './invoicing-routing.module';

import {effects, reducers} from './store';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import * as fromPopups from './popups';
import {FileUploadDialogComponent} from './popups';
import {InvoicingState} from './store/reducers';
import {AdminModule} from '../admin/admin.module';
import {businessServices} from './business-services';
import {services} from './services';
import {guards} from './guards';
import {AuthModule} from '../auth/auth.module';

export function clearState(reducer: ActionReducer<InvoicingState>): ActionReducer<InvoicingState> {
  return function(state: InvoicingState, action: Action): InvoicingState {
    if (action.type === '[Auth] clear state') {
      state = undefined;
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [clearState];

@NgModule({
  imports: [
    SharedModule,
    StorageModule,
    AdminModule,
    InvoicingRoutingModule,
    StoreModule.forFeature('invoicing', reducers, { metaReducers }),
    EffectsModule.forFeature(effects)
  ],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    ...fromPopups.popups
  ],
  providers: [
    ...businessServices,
    ...services,
    ...guards
  ],
  entryComponents: [
    FileUploadDialogComponent
  ]
})
export class InvoicingModule { }
