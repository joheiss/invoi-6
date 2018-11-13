import {mockState} from '../../../test/factories/mock-state';
import {selectNumberRangeEntities, selectNumberRangesLoaded} from './number-ranges.selectors';

describe('Number Ranges Selectors', () => {

  let state;

  beforeEach(() => {
    state = mockState();
  });

  describe('selectNumberRangeEntities', () => {
    it('should return the entities object containing all document links', () => {
      expect(selectNumberRangeEntities(state)).toEqual(state.invoicing.numberRanges.entities);
    });
  });

  describe('selectNumberRangesLoaded', () => {
    it('should return true ', () => {
      const expected = state.invoicing.numberRanges.loaded;
      expect(selectNumberRangesLoaded(state)).toEqual(expected);
    });
  });
});
