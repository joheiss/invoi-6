import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import * as fromReceivers from '../actions/receivers.actions';
import {ReceiverData} from 'jovisco-domain';

export interface ReceiverSingle {
  isDirty: boolean;
  receiver: ReceiverData;
}
export interface ReceiverState extends EntityState<ReceiverData> {
  loaded: boolean;
  loading: boolean;
  current?: ReceiverSingle;
  error: any;
}

export const receiverAdapter: EntityAdapter<ReceiverData> = createEntityAdapter<ReceiverData>({
  selectId: (receiver: ReceiverData) => receiver.id,
  sortComparer: (a: ReceiverData, b: ReceiverData) => a.name.localeCompare(b.name)
});

const initialState: ReceiverState = receiverAdapter.getInitialState({
  loaded: false,
  loading: false,
  current: undefined,
  error: undefined
});

export function receiverReducer(state: ReceiverState = initialState, action: fromReceivers.ReceiverAction): ReceiverState {
  switch (action.type) {

    case fromReceivers.QUERY_RECEIVERS: {
      return { ...state, loading: true, loaded: false, error: undefined, current: undefined };
    }

    case fromReceivers.ADDED_RECEIVER: {
      return receiverAdapter.addOne(action.payload, {...state, loaded: true, loading: false, error: undefined });
    }

    case fromReceivers.MODIFIED_RECEIVER: {
      return receiverAdapter.updateOne({ id: action.payload.id, changes: action.payload }, {...state, error: undefined });
    }

    case fromReceivers.REMOVED_RECEIVER: {
      return receiverAdapter.removeOne(action.payload.id, state);
    }

    case fromReceivers.COPY_RECEIVER_SUCCESS: {
      const current = { isDirty: true, receiver: action.payload };
      return { ...state, current, error: undefined };
    }

    case fromReceivers.NEW_RECEIVER_SUCCESS: {
      const current = { isDirty: true, receiver: action.payload };
      return { ...state,  current, error: undefined };
    }

    case fromReceivers.SELECT_RECEIVER: {
      const current = { isDirty: false, receiver: action.payload };
      return { ...state,  current, error: undefined };
    }

    case fromReceivers.CHANGE_RECEIVER_SUCCESS: {
      const current = { isDirty: true, receiver: action.payload };
      return { ...state,  current, error: undefined };
    }

    default:
      return state;
  }
}

// state selectors
export const {
  selectIds: selectReceiverIds,
  selectEntities: selectReceiverEntities,
  selectAll: selectAllReceivers,
  selectTotal: selectReceiversTotal } = receiverAdapter.getSelectors();

export const selectReceiversLoading = (state: ReceiverState) => state.loading;
export const selectReceiversLoaded = (state: ReceiverState) => state.loaded;
export const selectCurrentReceiver = (state: ReceiverState) => state.current?.receiver;
export const selectReceiversError = (state: ReceiverState) => state.error;


