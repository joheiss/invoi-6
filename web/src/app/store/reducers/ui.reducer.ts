import * as fromUi from '../actions/ui.actions';

export interface UiState {
  isSpinning: boolean;
}

const initialState: UiState = {
  isSpinning: false
};

export function uiReducer(state: UiState = initialState, action: fromUi.UiAction): UiState {
  switch (action.type) {

    case fromUi.START_SPINNING: {
      console.log('START SPINNING');
      return {...state, isSpinning: true };
    }

    case fromUi.STOP_SPINNING: {
      console.log('STOP SPINNING');
      return {...state, isSpinning: false };
    }

    default:
      return state;
  }
}

// state selectors
export const selectIsSpinning = (state: UiState) => state.isSpinning;


