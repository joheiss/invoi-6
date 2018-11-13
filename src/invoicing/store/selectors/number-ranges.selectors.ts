import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromNumberRanges from '../reducers/number-ranges.reducer';

export const selectNumberRangeState = createSelector(
  fromFeature.selectInvoicingState,
  (state: fromFeature.InvoicingState) => state.numberRanges
);

export const selectNumberRangeEntities = createSelector(
  selectNumberRangeState,
  fromNumberRanges.selectNumberRangeEntities
);

export const selectNumberRangesLoaded = createSelector(
  selectNumberRangeState,
  fromNumberRanges.selectNumberRangesLoaded)
;





