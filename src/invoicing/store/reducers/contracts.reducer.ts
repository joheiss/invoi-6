import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {ContractData} from '../../models/contract.model';
import * as fromContracts from '../actions/contracts.actions';

export interface ContractSingle {
  isDirty: boolean;
  contract: ContractData;
}
export interface ContractState extends EntityState<ContractData> {
  loaded: boolean;
  loading: boolean;
  current?: ContractSingle;
  error?: any;
}

export const contractAdapter: EntityAdapter<ContractData> = createEntityAdapter<ContractData>({
  selectId: (contract: ContractData) => contract.id,
  sortComparer: false
});

const initialState: ContractState = contractAdapter.getInitialState({
  loaded: false,
  loading: false,
  current: undefined,
  error: undefined
});

export function contractReducer(state: ContractState = initialState, action: fromContracts.ContractAction): ContractState {
  switch (action.type) {

    case fromContracts.QUERY_CONTRACTS: {
      return { ...state, loading: true, loaded: false, error: undefined, current: undefined };
    }

    case fromContracts.ADDED_CONTRACT: {
      return contractAdapter.addOne(action.payload, {...state, loaded: true, loading: false, error: undefined });
    }

    case fromContracts.MODIFIED_CONTRACT: {
      return contractAdapter.updateOne({ id: action.payload.id, changes: action.payload }, {...state, error: undefined });
    }

    case fromContracts.REMOVED_CONTRACT: {
      return contractAdapter.removeOne(action.payload.id, state);
    }

    case fromContracts.COPY_CONTRACT_SUCCESS: {
      const current = { isDirty: true, contract: action.payload };
      return { ...state, current, error: undefined };
    }

    case fromContracts.NEW_CONTRACT_SUCCESS: {
      const current = { isDirty: true, contract: action.payload };
      return { ...state, current, error: undefined };
    }

    case fromContracts.SELECT_CONTRACT: {
      const current = { isDirty: false, contract: action.payload };
      return { ...state,  current, error: undefined };
    }

    case fromContracts.CHANGE_CONTRACT_SUCCESS: {
      const current = { isDirty: true, contract: action.payload };
      return { ...state,  current, error: undefined };
    }

    case fromContracts.REMOVE_ALL_CONTRACTS: {
      return contractAdapter.removeAll({ ...state, loading: false, loaded: false, current: undefined });
    }

    default:
      return state;
  }
}

// state selectors
export const {
  selectIds: selectContractIds,
  selectEntities: selectContractEntities,
  selectAll: selectAllContracts,
  selectTotal: selectContractsTotal } = contractAdapter.getSelectors();

export const selectContractsLoading = (state: ContractState) => state.loading;
export const selectContractsLoaded = (state: ContractState) => state.loaded;
export const selectCurrentContract = (state: ContractState) => state.current.contract;
export const selectContractsError = (state: ContractState) => state.error;

