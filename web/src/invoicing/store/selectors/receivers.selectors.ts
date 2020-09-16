import {createSelector} from '@ngrx/store';
import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromReceivers from '../reducers/receivers.reducer';
import {ReceiverFactory} from 'jovisco-domain';

export const selectReceiverState = createSelector(
  fromFeature.selectInvoicingState,
  (state: fromFeature.InvoicingState) => state.receivers
);

export const selectReceiverIds = createSelector(
  selectReceiverState,
  fromReceivers.selectReceiverIds
);

export const selectReceiverEntities = createSelector(
  selectReceiverState,
  fromReceivers.selectReceiverEntities
);

export const selectAllReceivers = createSelector(
  selectReceiverState,
  fromReceivers.selectAllReceivers
);

export const selectAllReceiversAsObjArray = createSelector(
  selectAllReceivers,
  receivers => ReceiverFactory.fromDataArray(receivers)
);

export const selectReceiversLoaded = createSelector(
  selectReceiverState,
  fromReceivers.selectReceiversLoaded)
;

export const selectCurrentReceiver = createSelector(
  selectReceiverState,
  fromReceivers.selectCurrentReceiver
);

export const selectCurrentReceiverAsObj = createSelector(
  selectCurrentReceiver,
  receiver => receiver && ReceiverFactory.fromData(receiver)
);

export const selectSelectedReceiver = createSelector(
  selectReceiverEntities,
  fromRoot.getRouterState,
  (entity, router) => router.state && entity[router.state.params.id]
);

export const selectAllReceiversSorted = createSelector(
  selectReceiverEntities,
  selectReceiverIds,
  (entity, ids: number[]) => ids.map(id => entity[id])
);

export const selectAllReceiversSortedAsObjArray = createSelector(
  selectAllReceiversSorted,
  receivers => ReceiverFactory.fromDataArray(receivers)
);

export const selectActiveReceiversSortedAsObjArray = createSelector(
  selectAllReceiversSortedAsObjArray,
  receivers => receivers.filter(receiver => receiver.isActive())
);




