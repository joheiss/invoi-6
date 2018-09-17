import * as moment from 'moment';

export class DateUtilities {

  public static addDaysToDate(date: Date, days: number): Date {
    const mdt = moment(date);
    mdt.add(days, 'days').calendar();
    return mdt.toDate();
  }

  public static subtractDaysToDate(date: Date, days: number): Date {
    const mdt = moment(date);
    mdt.subtract(days, 'days').calendar();
    return mdt.toDate();
  }
}
