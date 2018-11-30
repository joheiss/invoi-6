import {RevenueData, RevenuePerYearData} from '../../invoicing/models/revenue.model';
import {revenueAdapter, RevenueState} from '../../invoicing/store/reducers/revenues.reducer';

export const mockRevenuesState = (): RevenueState => {
  const state = revenueAdapter.getInitialState();
  return revenueAdapter.addMany(mockAllRevenues(), {...state, loading: false, loaded: true, error: undefined});
};

export const mockAllRevenues = (): RevenueData[] => {

  return [
    {
      id: '2018',
      organization: 'GHQ',
      months: {
        1: {1901: 1.0, 1902: 1.0}, 2: {1901: 1.0, 1902: 1.0}, 3: {1901: 1.0, 1902: 1.0}, 4: {1901: 1.0, 1902: 1.0},
        5: {1901: 1.0, 1902: 1.0}, 6: {1901: 1.0, 1902: 1.0}, 7: {1901: 1.0, 1902: 1.0}, 8: {1901: 1.0, 1902: 1.0},
        9: {1901: 1.0, 1902: 1.0}, 10: {1901: 1.0, 1902: 1.0}, 11: {1901: 1.0, 1902: 1.0}, 12: {1901: 1.0, 1902: 1.0}
      }
    },
    {
      id: '2017',
      organization: 'GHQ',
      months: {
        1: {1901: 1.0, 1902: 1.0}, 2: {1901: 1.0, 1902: 1.0}, 3: {1901: 1.0, 1902: 1.0}, 4: {1901: 1.0, 1902: 1.0},
        5: {1901: 1.0, 1902: 1.0}, 6: {1901: 1.0, 1902: 1.0}, 7: {1901: 1.0, 1902: 1.0}, 8: {1901: 1.0, 1902: 1.0},
        9: {1901: 1.0, 1902: 1.0}, 10: {1901: 1.0, 1902: 1.0}, 11: {1901: 1.0, 1902: 1.0}, 12: {1901: 1.0, 1902: 1.0}
      }
    },
    {
      id: '2016',
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
  return [
    { year: 2018, revenuePerMonth: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], revenuePerYear: 10 },
    { year: 2017, revenuePerMonth: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], revenuePerYear: 12 },
    { year: 2016, revenuePerMonth: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], revenuePerYear: 12 }
  ];
};

