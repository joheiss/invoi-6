import {DateUtilities} from './date-utilities';

describe('Date Utilities', () => {
  it('should return the correct date when adding days to a date', () => {
    const inputDate = new Date(2018, 0, 1);
    const expectedDate = new Date(2019, 0, 1);
    expect(DateUtilities.addDaysToDate(inputDate, 365)).toEqual(expectedDate);
  });

  it('should return the correct date when subtracting days from a date', () => {
    const inputDate = new Date(2019, 0, 1);
    const expectedDate = new Date(2018, 11, 31);
    expect(DateUtilities.subtractDaysToDate(inputDate, 1)).toEqual(expectedDate);
  });

  it('should return a date with time is 00:00:00:000', () => {
    const inputDate = new Date(2019, 0, 1);
    const expectedDate = new Date(2019, 0, 1, 0, 0, 0, 0);
    expect(DateUtilities.getDateOnly(inputDate)).toEqual(expectedDate);
  });

  it('should return a date with time is 23:59:59:999', () => {
    const inputDate = new Date(2019, 0, 1);
    const expectedDate = new Date(2019, 0, 1, 23, 59, 59, 999);
    expect(DateUtilities.getEndDate(inputDate)).toEqual(expectedDate);
  });
});
