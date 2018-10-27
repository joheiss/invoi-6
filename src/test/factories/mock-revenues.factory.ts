import {RevenuePerYearData} from '../../invoicing/models/revenue.model';

export const mockAllRevenues = (): RevenuePerYearData[] => {
  return [
    { year: 2018, revenuePerMonth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], revenuePerYear: 10 },
    { year: 2017, revenuePerMonth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], revenuePerYear: 12 },
    { year: 2016, revenuePerMonth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], revenuePerYear: 12 }
  ];
};

