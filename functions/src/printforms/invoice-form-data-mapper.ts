import {IInvoiceFormData, IInvoiceItemFormData} from './invoice-form-data';
import {DateUtilities} from '../utilities/date-utilities';

export class InvoiceFormDataMapper {

  private formData: IInvoiceFormData;
  private currencyOptions: any = {};
  private dateTimeFormat: Intl.DateTimeFormat;
  private numberFormat: Intl.NumberFormat;
  private currencyFormat: Intl.NumberFormat;

  constructor(private invoice: any,
              private receiver: any,
              private locale: string = 'de-DE',
              private currency: string = 'EUR') {

    this.currencyOptions = {
      style: 'currency',
      currency: this.currency,
      currencyDisplay: 'symbol'
    };

    this.dateTimeFormat = new Intl.DateTimeFormat(this.locale);
    this.numberFormat = new Intl.NumberFormat(this.locale);
    this.currencyFormat = new Intl.NumberFormat(this.locale, this.currencyOptions);
  }

  public map(): IInvoiceFormData {

    this.formData = {} as IInvoiceFormData;
    this.mapAddress();
    this.mapReference();
    this.mapPaymentTerms();
    this.mapText();
    this.mapItems();
    this.mapTotals();
    return this.formData;
  }

  private mapAddress(): void {

    this.formData.address = [];

    this.formData.address.push(this.receiver.name);
    this.formData.address.push(this.receiver.nameAdd);
    this.formData.address.push(this.receiver.address.street);
    this.formData.address.push(this.receiver.address.postalCode + ' ' + this.receiver.address.city);
  }

  private mapReference(): void {

    this.formData.invoiceId = this.invoice.id.toString();
    this.formData.invoiceDate = this.dateTimeFormat.format(new Date(this.invoice.issuedAt));
    this.formData.customerId = this.receiver.id.toString();
    this.formData.billingPeriod = this.invoice.billingPeriod;
  }

  private mapPaymentTerms(): void {

    this.formData.paymentTerms = this.invoice.paymentTerms;
  }

  private mapText(): void {

    this.formData.text = this.invoice.invoiceText;
  }

  private mapItems(): void {

    this.formData.items = [];

    this.invoice.items.forEach(item => {
      const mappedItem: IInvoiceItemFormData = {} as IInvoiceItemFormData;
      mappedItem.itemId = item.id.toString();
      mappedItem.description = item.description;
      //mappedItem.quantity = item.quantity.toLocaleString(this.locale);
      mappedItem.quantity = this.numberFormat.format(item.quantity);
      // mappedItem.unitPrice = item.pricePerUnit.toLocaleString(this.locale, this.currencyOptions);
      mappedItem.unitPrice = this.currencyFormat.format(item.pricePerUnit);
      const netValue = item.quantity * item.pricePerUnit;
      // mappedItem.netValue = netValue.toLocaleString(this.locale, this.currencyOptions);
      mappedItem.netValue = this.currencyFormat.format(netValue);
      this.formData.items.push(mappedItem);
    });
  }

  private mapTotals(): void {

    this.formData.vatPercentage = this.invoice.vatPercentage.toString();
    this.formData.cashDiscountPercentage = this.invoice.cashDiscountPercentage.toString();
    this.formData.cashDiscountDueDate = this.dateTimeFormat.format(
      DateUtilities.addDaysToDate(this.invoice.issuedAt, this.invoice.cashDiscountDays));
    const totalNetValue = this.invoice.items.reduce((acc, item) => acc + item.quantity * item.pricePerUnit, 0);
    // this.formData.totalNetValue = totalNetValue.toLocaleString(this.locale, this.currencyOptions);
    this.formData.totalNetValue = this.currencyFormat.format(totalNetValue);
    const totalVatAmount = totalNetValue * this.invoice.vatPercentage / 100;
    // this.formData.totalVatAmount = totalVatAmount.toLocaleString(this.locale, this.currencyOptions);
    this.formData.totalVatAmount = this.currencyFormat.format(totalVatAmount);
    const totalGrossAmount = totalNetValue + totalVatAmount;
    // this.formData.totalGrossAmount = totalGrossAmount.toLocaleString(this.locale, this.currencyOptions);
    this.formData.totalGrossAmount = this.currencyFormat.format(totalGrossAmount);
    const cashDiscountBaseAmount = this.invoice.items.reduce((acc, item) => {
      if (item.cashDiscountAllowed) {
        const netValue = item.quantity * item.pricePerUnit;
        const grossValue = netValue * (100 + this.invoice.vatPercentage) / 100;
        return acc + grossValue;
      } else {
        return acc;
      }
    }, 0);
    // this.formData.cashDiscountBaseAmount = cashDiscountBaseAmount.toLocaleString(this.locale, this.currencyOptions);
    this.formData.cashDiscountBaseAmount = this.currencyFormat.format(cashDiscountBaseAmount);
    const cashDiscountAmount = cashDiscountBaseAmount * this.invoice.cashDiscountPercentage / 100;
    // this.formData.cashDiscountAmount = cashDiscountAmount.toLocaleString(this.locale, this.currencyOptions);
    this.formData.cashDiscountAmount = this.currencyFormat.format(cashDiscountAmount);
    const paymentAmount = totalGrossAmount - cashDiscountAmount;
    // this.formData.payableAmount = paymentAmount.toLocaleString(this.locale, this.currencyOptions);
    this.formData.payableAmount = this.currencyFormat.format(paymentAmount);
  }
}

