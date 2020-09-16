import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import * as fromNumberRanges from '../actions/number-ranges.actions';
import {NumberRangeData} from 'jovisco-domain';

export interface NumberRangeState extends EntityState<NumberRangeData> {
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const numberRangeAdapter: EntityAdapter<NumberRangeData> = createEntityAdapter<NumberRangeData>({
  selectId: (numberRange: NumberRangeData) => numberRange.id,
  sortComparer: (a: NumberRangeData, b: NumberRangeData) => a.id.localeCompare(b.id)
});

const initialState: NumberRangeState = numberRangeAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: undefined
});

export function numberRangeReducer(state: NumberRangeState = initialState, action: fromNumberRanges.NumberRangeAction): NumberRangeState {
  switch (action.type) {

    case fromNumberRanges.QUERY_NUMBER_RANGES: {
      return { ...state, loading: true, loaded: false, error: undefined };
    }

    case fromNumberRanges.ADDED_NUMBER_RANGE: {
      return numberRangeAdapter.addOne(action.payload, {...state, loaded: true, loading: false, error: undefined });
    }

    case fromNumberRanges.MODIFIED_NUMBER_RANGE: {
      return numberRangeAdapter.updateOne({ id: action.payload.id, changes: action.payload }, {...state, error: undefined });
    }

    case fromNumberRanges.REMOVED_NUMBER_RANGE: {
      return numberRangeAdapter.removeOne(action.payload.id, state);
    }

    default:
      return state;
  }
}

// state selectors
export const {
  selectIds: selectNumberRangeIds,
  selectEntities: selectNumberRangeEntities,
  selectAll: selectAllNumberRanges,
  selectTotal: selectNumberRangeTotal } = numberRangeAdapter.getSelectors();

export const selectNumberRangesLoading = (state: NumberRangeState) => state.loading;
export const selectNumberRangesLoaded = (state: NumberRangeState) => state.loaded;
export const selectNumberRangeError = (state: NumberRangeState) => state.error;


