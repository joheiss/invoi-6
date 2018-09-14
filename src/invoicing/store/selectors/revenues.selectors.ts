import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromRevenues from '../reducers/revenues.reducer';
import {Revenue} from '../../models/revenue.model';

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
  ranges => ranges.map(ranges => Revenue.createFromData(ranges))
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




