import {revenueAdapter, RevenueState} from '../../invoicing/store/reducers/revenues.reducer';
import {RevenueData, RevenuePerYearData} from 'jovisco-domain';
import {DateTime} from 'luxon';

export const mockRevenuesState = (): RevenueState => {
  const state = revenueAdapter.getInitialState();
  return revenueAdapter.addMany(mockAllRevenues(), {...state, loading: false, loaded: true, error: undefined});
};

export const mockAllRevenues = (): RevenueData[] => {

  const year = DateTime.local().year;
  return [
    {
      id: year.toString(),
      organization: 'GHQ',
      months: {
        1: {1901: 1.0, 1902: 1.0}, 2: {1901: 1.0, 1902: 1.0}, 3: {1901: 1.0, 1902: 1.0}, 4: {1901: 1.0, 1902: 1.0},
        5: {1901: 1.0, 1902: 1.0}, 6: {1901: 1.0, 1902: 1.0}, 7: {1901: 1.0, 1902: 1.0}, 8: {1901: 1.0, 1902: 1.0},
        9: {1901: 1.0, 1902: 1.0}, 10: {1901: 1.0, 1902: 1.0}, 11: {1901: 1.0, 1902: 1.0}, 12: {1901: 1.0, 1902: 1.0}
      }
    },
    {
      id: (year - 1).toString(),
      organization: 'GHQ',
      months: {
        1: {1901: 1.0, 1902: 1.0}, 2: {1901: 1.0, 1902: 1.0}, 3: {1901: 1.0, 1902: 1.0}, 4: {1901: 1.0, 1902: 1.0},
        5: {1901: 1.0, 1902: 1.0}, 6: {1901: 1.0, 1902: 1.0}, 7: {1901: 1.0, 1902: 1.0}, 8: {1901: 1.0, 1902: 1.0},
        9: {1901: 1.0, 1902: 1.0}, 10: {1901: 1.0, 1902: 1.0}, 11: {1901: 1.0, 1902: 1.0}, 12: {1901: 1.0, 1902: 1.0}
      }
    },
    {
      id: (year - 2).toString(),
      organization: 'GHQ',
      months: {
        1: {1901: 1.0, 1902: 1.0}, 2: {1901: 1.0, 1902: 1.0}, 3: {1901: 1.0, 1902: 1.0}, 4: {1901: 1.0, 1902: 1.0},
        5: {1901: 1.0, 1902: 1.0}, 6: {1901: 1.0, 1902: 1.0}, 7: {1901: 1.0, 1902: 1.0}, 8: {1901: 1.0, 1902: 1.0},
        9: {1901: 1.0, 1902: 1.0}, 10: {1901: 1.0, 1902: 1.0}, 11: {1901: 1.0, 1902: 1.0}, 12: {1901: 1.0, 1902: 1.0}
      }
    }
  ];
};


export const mockAllRevenuesPerYear = (): RevenuePerYearData[] => {
  const year = DateTime.local().year;
  return [
    { year: year, revenuePerMonth: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], revenuePerYear: 10 },
    { year: year - 1, revenuePerMonth: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], revenuePerYear: 12 },
    { year: year - 2, revenuePerMonth: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], revenuePerYear: 12 }
  ];
};

