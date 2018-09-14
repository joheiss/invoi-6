import {createSelector} from '@ngrx/store';
import * as fromUi from '../reducers/ui.reducer';
import {getUiState} from '../reducers';

export const selectIsSpinning = createSelector(
  getUiState,
  fromUi.selectIsSpinning
);
