import {AddedNumberRange, ModifiedNumberRange, QueryNumberRanges, RemovedNumberRange} from '../actions';
import {numberRangeAdapter, numberRangeReducer, NumberRangeState} from './number-ranges.reducer';
import {mockAllNumberRanges} from '../../../test/factories/mock-number-ranges.factory';

describe('Number Ranges Reducer', () => {

  const initialState: NumberRangeState = numberRangeAdapter.getInitialState({
    loading: false,
    loaded: false,
    error: undefined
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = { type: 'Noop' } as any;
      const result = numberRangeReducer(undefined, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Query Number Ranges Action', () => {
    it('should toggle the loading state', () => {
      const action = new QueryNumberRanges();
      const result = numberRangeReducer(undefined, action);
      expect(result).toEqual({...initialState, loading: true });
    });
  });

  describe('Added Number Range Event', () => {
    it('should toggle the loading state and add a number range to the state', () => {
      const numberRange = mockAllNumberRanges()[0];
      const action = new AddedNumberRange(numberRange);
      const result = numberRangeReducer(undefined, action);
      expect(result).toEqual({
        ...initialState,
        entities: { [numberRange.id]: numberRange },
        ids: [numberRange.id],
        loading: false,
        loaded: true
      });
    });
  });

  describe('Modified Number Range Event', () => {
    it('should update the number range in the state', () => {
      const numberRange = mockAllNumberRanges()[0];
      const someState = {
        ...initialState,
        entities: { [numberRange.id]: numberRange },
        ids: [numberRange.id],
        loading: false,
        loaded: true
      };
      const modifiedNumberRange = { ...numberRange, lastUsedId: '9999' };
      const action = new ModifiedNumberRange(modifiedNumberRange);
      const result = numberRangeReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: { [numberRange.id]: modifiedNumberRange }
      });
    });
  });

  describe('Removed Number Range Event', () => {
    it('should remove the number range from the state', () => {
      const numberRange = mockAllNumberRanges()[0];
      const someState = {
        ...initialState,
        entities: { [numberRange.id]: numberRange },
        ids: [numberRange.id],
        loading: false,
        loaded: true
      };
      const action = new RemovedNumberRange(numberRange);
      const result = numberRangeReducer(someState, action);
      expect(result).toEqual({
        ...someState,
        entities: {},
        ids: []
      });
    });
  });
});
