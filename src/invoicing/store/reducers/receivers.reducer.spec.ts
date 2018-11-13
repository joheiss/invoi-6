import {
  AddedReceiver,
  ChangeReceiverSuccess,
  CopyReceiverSuccess,
  ModifiedReceiver,
  NewReceiverSuccess,
  QueryReceivers,
  RemovedReceiver,
  SelectReceiver,
} from '../actions';
import {receiverAdapter, receiverReducer, ReceiverState} from './receivers.reducer';
import {mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';

describe('Receivers Reducer', () => {

  const initialState: ReceiverState = receiverAdapter.getInitialState({
    loading: false,
    loaded: false,
    current: undefined,
    error: undefined
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'Noop' } as any;
      const result = receiverReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Query Receivers Action', () => {
    it('should toggle the loading state', () => {
      const action = new QueryReceivers();
      const result = receiverReducer(undefined, action);
      expect(result).toEqual({...initialState, loading: true });
    });
  });

  describe('Added Receiver Event', () => {
    it('should toggle the loading state and add a receiver to the state', () => {
      const receiver = mockSingleReceiver();
      const action = new AddedReceiver(receiver);
      const result = receiverReducer(undefined, action);
      expect(result).toEqual({
        ...initialState,
        entities: { [receiver.id]: receiver },
        ids: [receiver.id],
        loading: false,
        loaded: true
      });
    });
  });

  describe('Modified Receiver Event', () => {
    it('should update the receiver in the state', () => {
      const receiver = mockSingleReceiver();
      const someState = {
        ...initialState,
        entities: { [receiver.id]: receiver },
        ids: [receiver.id],
        loading: false,
        loaded: true
      };
      const modifiedReceiver = { ...receiver, internalText: '... modified' };
      const action = new ModifiedReceiver(modifiedReceiver);
      const result = receiverReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: { [receiver.id]: modifiedReceiver }
      });
    });
  });

  describe('Removed Receiver Event', () => {
    it('should remove the receiver from the state', () => {
      const receiver = mockSingleReceiver();
      const someState = {
        ...initialState,
        entities: { [receiver.id]: receiver },
        ids: [receiver.id],
        loading: false,
        loaded: true
      };
      const action = new RemovedReceiver(receiver);
      const result = receiverReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: {},
        ids: []
      });
    });
  });

  describe('Copy Receiver Success Event', () => {
    it('should set the current receiver in state', () => {
      const receiver = mockSingleReceiver();
      const someState = {
        ...initialState,
        entities: { [receiver.id]: receiver },
        ids: [receiver.id],
        loading: false,
        loaded: true
      };
      const action = new CopyReceiverSuccess(receiver);
      const result = receiverReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, receiver: receiver },
        error: undefined
      });
    });
  });

  describe('New Receiver Success Event', () => {
    it('should set the current receiver in state', () => {
      const receiver = mockSingleReceiver();
      const someState = {
        ...initialState,
        entities: { [receiver.id]: receiver },
        ids: [receiver.id],
        loading: false,
        loaded: true
      };
      const action = new NewReceiverSuccess(receiver);
      const result = receiverReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, receiver: receiver },
        error: undefined
      });
    });
  });

  describe('Select Receiver Command', () => {
    it('should set the current receiver in state', () => {
      const receiver = mockSingleReceiver();
      const someState = {
        ...initialState,
        entities: { [receiver.id]: receiver },
        ids: [receiver.id],
        loading: false,
        loaded: true
      };
      const action = new SelectReceiver(receiver);
      const result = receiverReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: false, receiver: receiver },
        error: undefined
      });
    });
  });

  describe('Change Receiver Success Event', () => {
    it('should set the current receiver in state', () => {
      const receiver = mockSingleReceiver();
      const someState = {
        ...initialState,
        entities: { [receiver.id]: receiver },
        ids: [receiver.id],
        loading: false,
        loaded: true
      };
      const action = new ChangeReceiverSuccess(receiver);
      const result = receiverReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        current: { isDirty: true, receiver: receiver },
        error: undefined
      });
    });
  });

});
