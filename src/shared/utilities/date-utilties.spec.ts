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
});
