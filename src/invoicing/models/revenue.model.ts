
import {ReportingHeaderData} from './reporting.model';

export interface RevenueData extends ReportingHeaderData {
  organization: string;
  months: { [month: string]: { [receiverId: string]: number } };
}

export interface RevenuePerYearData {
  year: number;
  revenuePerMonth: number[];
  revenuePerYear: number;
}

export class Revenue {
  public static createFromData(data: RevenueData): Revenue {
    return new Revenue(data);
  }

  constructor(private data: RevenueData) {
  }

  get year(): string {
    return this.data.id;
  }

  get revenueInMonths(): number[] {
    const valuesPerMonth = new Array(12).fill(0);
    Object.keys(this.data.months).forEach(month => valuesPerMonth[+month - 1] = this.getTotalRevenueInMonth(month));
    return valuesPerMonth;
  }

  get totalRevenue(): number {
    let total = 0;
    Object.keys(this.data.months).forEach(month => {
      total = total + this.getTotalRevenueInMonth(month);
    });
    return total;
  }

  getTotalRevenueInMonth(month: string): number {
    if (!this.data.months[month]) {
      return 0;
    }
    let total = 0;
    Object.keys(this.data.months[month]).forEach(receiver => total = total + this.data.months[month][receiver]);
    return total;
  }

  getTotalRevenueForReceiver(receiver: string): number {
    let total = 0;
    Object.keys(this.data.months).forEach(month => {
      total = total + this.getTotalRevenueInMonthForReceiver(receiver, month);
    });
    return total;
  }

  getTotalRevenueInMonthForReceiver(receiver: string, month: string): number {
    let total = 0;
    if (!this.data.months[month]) {
      return 0;
    }
    Object.keys(this.data.months[month])
      .filter(recv => recv === receiver)
      .forEach(recv => total = total + this.data.months[month][recv] || 0);
    return total;
  }
}
