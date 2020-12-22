import {
  AddedContract, ChangeContractSuccess, CopyContractSuccess,
  ModifiedContract, NewContractSuccess,
  QueryContracts, RemoveAllContracts,
  RemovedContract, SelectContract,
} from '../actions';
import {contractAdapter, contractReducer, ContractState} from './contracts.reducer';
import {mockSingleContract} from '../../../test/factories/mock-contracts.factory';

describe('Contracts Reducer', () => {

  const initialState: ContractState = contractAdapter.getInitialState({
    loading: false,
    loaded: false,
    current: undefined,
    error: undefined
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'Noop' } as any;
      const result = contractReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Query Contracts Action', () => {
    it('should toggle the loading state', () => {
      const action = new QueryContracts();
      const result = contractReducer(undefined, action);
      expect(result).toEqual({...initialState, loading: true });
    });
  });

  describe('Added Contract Event', () => {
    it('should toggle the loading state and add a contract to the state', () => {
      const contract = mockSingleContract();
      const action = new AddedContract(contract);
      const result = contractReducer(undefined, action);
      expect(result).toEqual({
        ...initialState,
        entities: { [contract.id]: contract },
        ids: [contract.id],
        loading: false,
        loaded: true
      });
    });
  });

  describe('Modified Contract Event', () => {
    it('should update the contract in the state', () => {
      const contract = mockSingleContract();
      const someState = {
        ...initialState,
        entities: { [contract.id]: contract },
        ids: [contract.id],
        loading: false,
        loaded: true
      };
      const modifiedContract = { ...contract, internalText: '... modified' };
      const action = new ModifiedContract(modifiedContract);
      const result = contractReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: { [contract.id]: modifiedContract }
      });
    });
  });

  describe('Removed Contract Event', () => {
    it('should remove the contract from the state', () => {
      const contract = mockSingleContract();
      const someState = {
        ...initialState,
        entities: { [contract.id]: contract },
        ids: [contract.id],
        loading: false,
        loaded: true
      };
      const action = new RemovedContract(contract);
      const result = contractReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: {},
        ids: []
      });
    });
  });

  describe('Copy Contract Success Event', () => {
    it('should set the current contract in state', () => {
      const contract = mockSingleContract();
      const someState = {
        ...initialState,
        entities: { [contract.id]: contract },
        ids: [contract.id],
        loading: false,
        loaded: true
      };
      const action = new CopyContractSuccess(contract);
      const result = contractReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, contract: contract },
        error: undefined
      });
    });
  });

  describe('New Contract Success Event', () => {
    it('should set the current contract in state', () => {
      const contract = mockSingleContract();
      const someState = {
        ...initialState,
        entities: { [contract.id]: contract },
        ids: [contract.id],
        loading: false,
        loaded: true
      };
      const action = new NewContractSuccess(contract);
      const result = contractReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, contract: contract },
        error: undefined
      });
    });
  });

  describe('Select Contract Command', () => {
    it('should set the current contract in state', () => {
      const contract = mockSingleContract();
      const someState = {
        ...initialState,
        entities: { [contract.id]: contract },
        ids: [contract.id],
        loading: false,
        loaded: true
      };
      const action = new SelectContract(contract);
      const result = contractReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: false, contract: contract },
        error: undefined
      });
    });
  });

  describe('Change Contract Success Event', () => {
    it('should set the current contract in state', () => {
      const contract = mockSingleContract();
      const someState = {
        ...initialState,
        entities: { [contract.id]: contract },
        ids: [contract.id],
        loading: false,
        loaded: true
      };
      const action = new ChangeContractSuccess(contract);
      const result = contractReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, contract: contract },
        error: undefined
      });
    });
  });

  describe('Remove All Contracts Command', () => {
    it('should clear the state', () => {
      const contract = mockSingleContract();
      const someState = {
        ...initialState,
        entities: { [contract.id]: contract },
        ids: [contract.id],
        loading: false,
        loaded: true
      };
      const action = new RemoveAllContracts();
      const result = contractReducer(someState, action);
      expect(result).toEqual(initialState);
    });
  });
});
