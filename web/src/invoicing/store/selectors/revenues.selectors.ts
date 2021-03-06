import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromRevenues from '../reducers/revenues.reducer';
import {RevenueFactory} from 'jovisco-domain';

export const selectRevenueState = createSelector(
  fromFeature.selectInvoicingState,
  (state: fromFeature.InvoicingState) => state.revenues
);

export const selectRevenueIds = createSelector(
  selectRevenueState,
  fromRevenues.selectRevenueIds
);

export const selectRevenueEntities = createSelector(
  selectRevenueState,
  fromRevenues.selectRevenueEntities
);

export const selectAllRevenues = createSelector(
  selectRevenueState,
  fromRevenues.selectAllRevenues
);

export const selectAllRevenuesAsObjArray = createSelector(
  selectAllRevenues,
  ranges => RevenueFactory.fromDataArray(ranges)
);

export const selectAllRecentRevenuesAsObjArray = createSelector(
  selectAllRevenuesAsObjArray,
  revenues => revenues.filter(r => +r.year > new Date().getFullYear() - 3)
);

export const selectRevenueTotal = createSelector(
  selectRevenueState,
  fromRevenues.selectRevenueTotal
);

export const selectRevenuesLoading = createSelector(
  selectRevenueState,
  fromRevenues.selectRevenuesLoading
);

export const selectRevenuesLoaded = createSelector(
  selectRevenueState,
  fromRevenues.selectRevenuesLoaded)
;

export const selectRevenueError = createSelector(
  selectRevenueState,
  fromRevenues.selectRevenuesError
);
