import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {DatePipe, DecimalPipe} from '@angular/common';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {InvoiceCardComponent} from './invoice-card.component';
import {mockInvoiceSummary} from '../../../test/factories/mock-invoices.factory';
import {SharedModule} from '../../../shared/shared.module';

describe('Invoice Card Component', () => {

  let component: InvoiceCardComponent;
  let fixture: ComponentFixture<InvoiceCardComponent>;
  let datePipe: DatePipe;
  let decimalPipe: DecimalPipe;

  beforeEach(async () => {
    return TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, SharedModule],
      declarations: [InvoiceCardComponent],
      providers: [
        DatePipe,
        DecimalPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCardComponent);
    component = fixture.componentInstance;
    datePipe = TestBed.inject(DatePipe);
    decimalPipe = TestBed.inject(DecimalPipe);
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('View', () => {

    describe('When component is initially displayed', () => {

      beforeEach(() => {
        component.summary = mockInvoiceSummary();
        fixture.detectChanges();
      });

      it(`should show the receiver's name in the card title`, async () => {
        const div = fixture.debugElement.query(By.css('mat-card-title')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(component.summary.receiverName);
      });

      it(`should show the issued at date in the card sub title`, async () => {
        const div = fixture.debugElement.query(By.css('mat-card-subtitle')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(datePipe.transform(component.summary.object.header.issuedAt, 'mediumDate'));
      });

      it(`should show the contract id as a link in the card`, async () => {
        const a = fixture.debugElement.query(By.css('#lnk_contractId')).nativeElement as HTMLAnchorElement;
        return expect(a.textContent).toContain(component.summary.object.header.contractId);
      });

      it(`should show the net value`, async () => {
        const div = fixture.debugElement.query(By.css('#div_netValue')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(decimalPipe.transform(component.summary.object.netValue, '1.2-2'));
      });

      it(`should show the vat amount`, async () => {
        const div = fixture.debugElement.query(By.css('#div_vatAmount')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(decimalPipe.transform(component.summary.object.vatAmount, '1.2-2'));
      });

      it(`should show the gross value`, async () => {
        const div = fixture.debugElement.query(By.css('#div_grossValue')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(decimalPipe.transform(component.summary.object.grossValue, '1.2-2'));
      });

      it(`should show the payment amount`, async () => {
        const div = fixture.debugElement.query(By.css('#div_paymentAmount')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(decimalPipe.transform(component.summary.object.paymentAmount, '1.2-2'));
      });

      it(`should show the due date`, async () => {
        const div = fixture.debugElement.query(By.css('#div_dueDate')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(datePipe.transform(component.summary.object.dueDate, 'mediumDate'));
      });

      it(`should show the cash discount date, if cash discount is granted`, async () => {
        const de = fixture.debugElement.query(By.css('#div_cashDiscountDate'));
        if (component.summary.object.header.cashDiscountPercentage > 0) {
          const div = de.nativeElement as HTMLDivElement;
          return expect(div.textContent).toContain(datePipe.transform(component.summary.object.cashDiscountDate, 'mediumDate'));
        } else {
          return expect(de).toBeFalsy();
        }
      });

      it('should navigate to contract details when contract link is pressed', async () => {
        const href = fixture.debugElement.query(By.css('#lnk_contractId')).nativeElement.getAttribute('href');
        return expect(href).toEqual(`/invoicing/contracts/${component.summary.object.header.contractId}`);
      });

    });
  });
});
