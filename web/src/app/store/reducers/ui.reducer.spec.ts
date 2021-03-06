import {TestBed} from '@angular/core/testing';
import {getUiState} from '.';
import {uiReducer} from './ui.reducer';
import {StartSpinning, StopSpinning} from '../actions';
import {mockState} from '../../../test/factories/mock-state';

describe('Ui Reducer', () => {
  const state = mockState();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
  });


  describe('undefined action', () => {
    it('should return the current state', () => {
      const uiState = getUiState(state);
      const action = {};
      // @ts-ignore
      const newUiState = uiReducer(uiState, action);
      expect(newUiState).toBe(uiState);
    });
  });

  describe('StartSpinning action', () => {
    it('should set isSpinning to true', () => {
      const uiState = getUiState(state);
      const action = new StartSpinning();
      const newUiState = uiReducer(uiState, action);
      expect(newUiState.isSpinning).toBe(true);
    });
  });

  describe('StopSpinning action', () => {
    it('should set isSpinning to true', () => {
      const uiState = getUiState(state);
      const action = new StopSpinning();
      const newUiState = uiReducer(uiState, action);
      expect(newUiState.isSpinning).toBe(false);
    });
  });
});
