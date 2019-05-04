import {numberRangeAdapter, NumberRangeState} from '../../invoicing/store/reducers/number-ranges.reducer';
import {NumberRangeData} from 'jovisco-domain';

export const mockAllNumberRanges = (): NumberRangeData[] => {
  return [
    { id: 'contracts', startAtId: '4000', endAtId: '4999', lastUsedId: '4950' },
    { id: 'credit-requests', startAtId: '6000', endAtId: '6999', lastUsedId: '6950' },
    { id: 'invoices', startAtId: '5000', endAtId: '5999', lastUsedId: '5950' },
    { id: 'receivers', startAtId: '1000', endAtId: '1999', lastUsedId: '1910' }
  ];
};

export const mockNumberRangeIds = (): string[] => {
  const allNumberRanges = mockAllNumberRanges();
  return allNumberRanges.map(nr => nr.id);
};

export const mockNumberRangeEntity = (): any => {
  const allNumberRanges = mockAllNumberRanges();
  const entity = {};
  allNumberRanges.map(nr => entity[nr.id] = nr);
  return entity;
};

export const mockNumberRangesState = (): NumberRangeState => {
  const numberRangesState = numberRangeAdapter.getInitialState();
  return numberRangeAdapter.addMany(mockAllNumberRanges(), {...numberRangesState, loading: false, loaded: true, error: undefined});
};
