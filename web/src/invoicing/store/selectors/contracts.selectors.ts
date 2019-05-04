import {createSelector} from '@ngrx/store';
import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromContracts from '../reducers/contracts.reducer';
import {ContractFactory} from 'jovisco-domain';

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
  contracts => ContractFactory.fromDataArray(contracts)
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
  contract => contract && ContractFactory.fromData(contract)
);

export const selectSelectedContract = createSelector(
  selectContractEntities,
  fromRoot.getRouterState,
  (entity, router) => router.state && entity[router.state.params.id]
);

export const selectActiveContracts = createSelector(
  selectAllContractsAsObjArray,
  contracts => contracts.filter(contract => contract.term.isActive || contract.term.isFuture).map(contract => contract.data)
);

export const selectInvoiceableContracts = createSelector(
  selectAllContractsAsObjArray,
  contracts => contracts.filter(contract => contract.term.isInvoiceable).map(contract => contract.data)
);

export const selectExpiredContracts = createSelector(
  selectAllContractsAsObjArray,
  contracts => contracts.filter(contract => !contract.term.isActive && !contract.term.isFuture).map(contract => contract.data)
);

