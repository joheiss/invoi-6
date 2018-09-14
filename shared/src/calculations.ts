import {Moment} from 'moment';

export function calcDiscountedNetValue(invoice: any): number {
  let value = 0;
  invoice.items.forEach(item => {
    const netValue = item.quantity * item.pricePerUnit;
    if (item.cashDiscountAllowed && invoice.cashDiscountPercentage > 0) {
      const grossValue = netValue + (netValue * item.vatPercentage / 100);
      const discountedGrossValue = grossValue - ( grossValue * invoice.cashDiscountPercentage / 100);
      const discountedNetValue = discountedGrossValue * 100 / (100 + item.vatPercentage );
      value = value + discountedNetValue;
    } else {
      value = value + netValue;
    }
  });
  return value;
}

export function calcDueDate(invoice: any): Date {
  const date = new Date(invoice.issuedAt);
  date.setDate(date.getDate() + invoice.dueInDays);
  return date;
}

export function calcNetValue(invoice: any): number {
  return invoice.items.reduce((total, current) => total + current.quantity * current.pricePerUnit, 0);
}

export function calcPaymentAmount(invoice: any): number {
  let value = 0;
  invoice.items.forEach(item => {
    const netValue = item.quantity * item.pricePerUnit;
    const grossValue = netValue + (netValue * item.vatPercentage / 100);
    if (item.cashDiscountAllowed && invoice.cashDiscountPercentage > 0) {
      const discountedGrossValue = grossValue - ( grossValue * invoice.cashDiscountPercentage / 100);
      value = value + discountedGrossValue;
    } else {
      value = value + grossValue;
    }
  });
  return value;
}

export function calcRevenuePeriod(mom: Moment): { year: number, month: number } {
  if (mom.date() > 15) {
    return { year: mom.year(), month: mom.month() + 1 };
  } else {
    if (mom.month() > 0) {
      return { year: mom.year(), month: mom.month() };
    }
    return { year: mom.year() - 1, month: 12 };
  }
}
