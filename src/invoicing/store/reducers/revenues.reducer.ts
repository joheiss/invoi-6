import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import * as fromRevenues from '../actions/revenues.actions';
import {RevenueData} from '../../models/revenue.model';

export interface RevenueState extends EntityState<RevenueData> {
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const revenueAdapter: EntityAdapter<RevenueData> = createEntityAdapter<RevenueData>({
  selectId: (revenue: RevenueData) => revenue.id,
  sortComparer: (a: RevenueData, b: RevenueData) => b.id.localeCompare(a.id)
});

const initialState: RevenueState = revenueAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: undefined
});

export function revenueReducer(state: RevenueState = initialState, action: fromRevenues.RevenueAction): RevenueState {
  switch (action.type) {

    case fromRevenues.QUERY_REVENUES: {
      return { ...state, loading: true, loaded: false, error: undefined };
    }

    case fromRevenues.ADDED_REVENUE: {
      return revenueAdapter.addOne(action.payload, {...state, loaded: true, loading: false, error: undefined });
    }

    case fromRevenues.MODIFIED_REVENUE: {
      return revenueAdapter.updateOne({ id: action.payload.id, changes: action.payload }, {...state, error: undefined });
    }

    case fromRevenues.REMOVED_REVENUE: {
      return revenueAdapter.removeOne(action.payload.id, state);
    }

    default:
      return state;
  }
}

// state selectors
export const {
  selectIds: selectRevenueIds,
  selectEntities: selectRevenueEntities,
  selectAll: selectAllRevenues,
  selectTotal: selectRevenueTotal } = revenueAdapter.getSelectors();

export const selectRevenuesLoading = (state: RevenueState) => state.loading;
export const selectRevenuesLoaded = (state: RevenueState) => state.loaded;
export const selectRevenuesError = (state: RevenueState) => state.error;


