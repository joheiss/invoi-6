import {createSelector} from '@ngrx/store';
import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromContracts from '../reducers/contracts.reducer';
import {Contract} from '../../models/contract.model';
import {Receiver} from '../../models/receiver.model';

export const selectContractState = createSelector(
  fromFeature.selectInvoicingState,
  (state: fromFeature.InvoicingState) => state.contracts
);

export const selectContractEntities = createSelector(
  selectContractState,
  fromContracts.selectContractEntities
);

export const selectAllContracts = createSelector(
  selectContractState,
  fromContracts.selectAllContracts
);

export const selectAllContractsAsObjArray = createSelector(
  selectAllContracts,
  contracts => contracts.map(contract => Contract.createFromData(contract))
);

export const selectContractsLoaded = createSelector(
  selectContractState,
  fromContracts.selectContractsLoaded
);

export const selectCurrentContract = createSelector(
  selectContractState,
  fromContracts.selectCurrentContract
);

export const selectCurrentContractAsObj = createSelector(
  selectCurrentContract,
  contract => contract && Contract.createFromData(contract)
);

export const selectSelectedContract = createSelector(
  selectContractEntities,
  fromRoot.getRouterState,
  (entity, router) => router.state && entity[router.state.params.id]
);

export const selectActiveContracts = createSelector(
  selectAllContractsAsObjArray,
  contracts => contracts.filter(contract => contract.isActive() || contract.isFuture()).map(contract => contract.data)
);

export const selectInvoiceableContracts = createSelector(
  selectAllContractsAsObjArray,
  contracts => contracts.filter(contract => contract.isInvoiceable() || contract.isFuture()).map(contract => contract.data)
);

export const selectExpiredContracts = createSelector(
  selectAllContractsAsObjArray,
  contracts => contracts.filter(contract => !contract.isActive() && !contract.isFuture()).map(contract => contract.data)
);

