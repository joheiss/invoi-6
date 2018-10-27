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
    datePipe = TestBed.get(DatePipe);
    decimalPipe = TestBed.get(DecimalPipe);
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

      it('should show the correct invoice id and color in id avatar', async () => {
        const div = fixture.debugElement.query(By.css('mat-card-header div.jo-id-avatar--inprocess')).nativeElement as HTMLDivElement;
        return expect(div.lastChild.textContent).toContain(component.summary.object.header.id);
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
        if (component.isCashDiscountAllowed(component.summary.object)) {
          const div = de.nativeElement as HTMLDivElement;
          return expect(div.textContent).toContain(datePipe.transform(component.summary.object.cashDiscountDate, 'mediumDate'));
        } else {
          return expect(de).toBeFalsy();
        }
      });

      it(`should show the details button`, async () => {
        const a = fixture.debugElement.query(By.css('#btn_details'));
        return expect(a).toBeDefined();
      });

      it(`should show the copy button`, async () => {
        const btn = fixture.debugElement.query(By.css('#btn_copy'));
        return expect(btn).toBeDefined();
      });

      it(`should not show the delete button if invoice is not deletable`, async () => {
        component.summary.changeable = false;
        const btn = fixture.debugElement.query(By.css('#btn_delete'));
        return expect(btn).toBeFalsy();
      });

      it('should navigate to contract details when contract link is pressed', async () => {
        const href = fixture.debugElement.query(By.css('#lnk_contractId')).nativeElement.getAttribute('href');
        return expect(href).toEqual(`/invoicing/contracts/${component.summary.object.header.contractId}`);
      });

      it('should navigate to invoice details when details button is pressed', async () => {
        const href = fixture.debugElement.query(By.css('#btn_details')).nativeElement.getAttribute('href');
        return expect(href).toEqual(`/invoicing/invoices/${component.summary.object.header.id}`);
      });

      it('should invoke onCopy handler when copy button is pressed', async () => {
        const spy = jest.spyOn(component, 'onCopy');
        fixture.debugElement.query(By.css('#btn_copy')).triggerEventHandler('click', null);
        return expect(spy).toHaveBeenCalled();
      });
    });

    describe('When component is initially displayed for a deletable contract', () => {

      beforeEach(() => {
        component.summary = {...mockInvoiceSummary(), changeable: true };
        fixture.detectChanges();
      });

      it(`should show the delete button if invoice is deletable`, async () => {
        const btn = fixture.debugElement.query(By.css('#btn_delete'));
        return expect(btn).toBeTruthy();
      });

      it('should invoke onDelete handler when delete button is pressed', async () => {
        const spy = jest.spyOn(component, 'onDelete');
        fixture.debugElement.query(By.css('#btn_delete')).triggerEventHandler('click', null);
        return expect(spy).toHaveBeenCalled();
      });
    });
  });
});
