import * as fromSelectors from './ui.selectors';
import {mockState} from '../../../test/factories/mock-state';

describe('Ui Selectors', () => {
  const state = mockState();

  describe('selectIsSpinning', () => {

    it('should return true or false', () => {
      const actual = fromSelectors.selectIsSpinning(state);
      expect(actual).toBe(true);
    });
  });

});
