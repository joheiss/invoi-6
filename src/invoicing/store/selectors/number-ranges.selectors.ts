import {createSelector} from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromNumberRanges from '../reducers/number-ranges.reducer';
import {NumberRange} from '../../models/number-range.model';

export const selectNumberRangeState = createSelector(
  fromFeature.selectInvoicingState,
  (state: fromFeature.InvoicingState) => state.numberRanges
);

export const selectNumberRangeIds = createSelector(
  selectNumberRangeState,
  fromNumberRanges.selectNumberRangeIds
);

export const selectNumberRangeEntities = createSelector(
  selectNumberRangeState,
  fromNumberRanges.selectNumberRangeEntities
);

export const selectAllNumberRanges = createSelector(
  selectNumberRangeState,
  fromNumberRanges.selectAllNumberRanges
);

export const selectAllNumberRangesAsObjArray = createSelector(
  selectAllNumberRanges,
  ranges => ranges.map(ranges => NumberRange.createFromData(ranges))
);

export const selectNumberRangeTotal = createSelector(
  selectNumberRangeState,
  fromNumberRanges.selectNumberRangeTotal
);

export const selectNumberRangesLoading = createSelector(
  selectNumberRangeState,
  fromNumberRanges.selectNumberRangesLoading
);

export const selectNumberRangesLoaded = createSelector(
  selectNumberRangeState,
  fromNumberRanges.selectNumberRangesLoaded)
;

export const selectNumberRangeError = createSelector(
  selectNumberRangeState,
  fromNumberRanges.selectNumberRangeError
);




