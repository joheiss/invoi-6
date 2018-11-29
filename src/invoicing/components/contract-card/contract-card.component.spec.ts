import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ContractCardComponent} from './contract-card.component';
import {MaterialModule} from '../../../shared/material.module';
import {mockContractSummary} from '../../../test/factories/mock-contracts.factory';
import {By} from '@angular/platform-browser';
import {DatePipe, DecimalPipe} from '@angular/common';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('Contract Card Component', () => {

  let component: ContractCardComponent;
  let fixture: ComponentFixture<ContractCardComponent>;
  let datePipe: DatePipe;
  let decimalPipe: DecimalPipe;

  beforeEach(async () => {
    return TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, MaterialModule, FlexLayoutModule],
      declarations: [ContractCardComponent],
      providers: [
        DatePipe,
        DecimalPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCardComponent);
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
        component.summary = mockContractSummary();
        fixture.detectChanges();
      });

      it('should show the contract description in the card title', async () => {
        const div = fixture.debugElement.query(By.css('mat-card-title')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(component.summary.object.header.description);
      });

      it(`should show the receiver's name in the card sub title`, async () => {
        const div = fixture.debugElement.query(By.css('mat-card-subtitle')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(component.summary.receiverName);
      });

      it(`should show the customer id as a link in the card`, async () => {
        const a = fixture.debugElement.query(By.css('#lnk_customerid')).nativeElement as HTMLAnchorElement;
        return expect(a.textContent).toContain(component.summary.object.header.customerId);
      });

      it(`should show the contract start date`, async () => {
        const div = fixture.debugElement.query(By.css('#div_contractstart')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(datePipe.transform(component.summary.object.header.startDate, 'mediumDate'));
      });

      it(`should show the contract end date`, async () => {
        const div = fixture.debugElement.query(By.css('#div_contractend')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(datePipe.transform(component.summary.object.header.endDate, 'mediumDate'));
      });

      it(`should show the contract budget`, async () => {
        const div = fixture.debugElement.query(By.css('#div_budget')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(decimalPipe.transform(component.summary.object.header.budget, '1.0-0'));
      });

      it(`should show the contract revenue`, async () => {
        const div = fixture.debugElement.query(By.css('#div_revenue')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(decimalPipe.transform(component.summary.revenue, '1.0-0'));
      });

      it(`should show the last invoice as a link in the card`, async () => {
        const a = fixture.debugElement.query(By.css('#lnk_lastinvoice')).nativeElement as HTMLAnchorElement;
        return expect(a.textContent).toContain(component.summary.lastInvoiceId);
      });

      it('should navigate to receiver details when receiver link is pressed', async () => {
        const href = fixture.debugElement.query(By.css('#lnk_customerid')).nativeElement.getAttribute('href');
        return expect(href).toEqual(`/invoicing/receivers/${component.summary.object.header.customerId}`);
      });

      it('should navigate to last invoice details when last invoice link is pressed', async () => {
        const href = fixture.debugElement.query(By.css('#lnk_lastinvoice')).nativeElement.getAttribute('href');
        return expect(href).toEqual(`/invoicing/invoices/${component.summary.lastInvoiceId}`);
      });

    });
  });
});
