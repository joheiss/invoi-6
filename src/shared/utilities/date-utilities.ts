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

  public static getDateOnly(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  public static getEndDate(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }
}
