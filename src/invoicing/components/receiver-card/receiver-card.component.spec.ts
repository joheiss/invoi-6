import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../../../shared/material.module';
import {By} from '@angular/platform-browser';
import {DatePipe, DecimalPipe} from '@angular/common';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReceiverCardComponent} from './receiver-card.component';
import {mockReceiverSummary} from '../../../test/factories/mock-receivers.factory';

describe('Receiver Card Component', () => {

  let component: ReceiverCardComponent;
  let fixture: ComponentFixture<ReceiverCardComponent>;
  let datePipe: DatePipe;
  let decimalPipe: DecimalPipe;

  beforeEach(async () => {
    return TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, MaterialModule, FlexLayoutModule],
      declarations: [ReceiverCardComponent],
      providers: [
        DatePipe,
        DecimalPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverCardComponent);
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
        component.summary = mockReceiverSummary();
        fixture.detectChanges();
      });

      it('should show the correct receiver id and color in id avatar', async () => {
        const div = fixture.debugElement.query(By.css('mat-card-header div.jo-id-avatar--ok')).nativeElement as HTMLDivElement;
        return expect(div.lastChild.textContent).toContain(component.summary.object.header.id);
      });

      it(`should show the receiver's name in the card title`, async () => {
        const div = fixture.debugElement.query(By.css('mat-card-title')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(component.summary.object.header.name);
      });

      it(`should show the status description in the card sub title`, async () => {
        const div = fixture.debugElement.query(By.css('#div_status')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain('aktiv');
      });

      it(`should show the number of active contracts`, async () => {
        const div = fixture.debugElement.query(By.css('#div_activeContracts')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(component.summary.activeContractsCount);
      });

      it(`should show the number of expired contracts`, async () => {
        const div = fixture.debugElement.query(By.css('#div_expiredContracts')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(component.summary.expiredContractsCount);
      });

      it(`should show the last contract id as a link`, async () => {
        const a = fixture.debugElement.query(By.css('#lnk_lastContract')).nativeElement as HTMLAnchorElement;
        return expect(a.textContent).toContain(component.summary.lastContractId);
      });

      it(`should show the number of due invoices`, async () => {
        const div = fixture.debugElement.query(By.css('#div_dueInvoices')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(component.summary.dueInvoicesCount);
      });

      it(`should show the number of open invoices`, async () => {
        const div = fixture.debugElement.query(By.css('#div_openInvoices')).nativeElement as HTMLDivElement;
        return expect(div.textContent).toContain(component.summary.openInvoicesCount);
      });

      it(`should show the last invoice id as a link`, async () => {
        const a = fixture.debugElement.query(By.css('#lnk_lastInvoice')).nativeElement as HTMLAnchorElement;
        return expect(a.textContent).toContain(component.summary.lastInvoiceId);
      });

      it(`should show the details button`, async () => {
        const a = fixture.debugElement.query(By.css('#btn_details'));
        return expect(a).toBeTruthy();
      });

      it(`should show the copy button`, async () => {
        const btn = fixture.debugElement.query(By.css('#btn_copy'));
        return expect(btn).toBeTruthy();
      });

      it(`should not show the delete button if receiver is not deletable`, async () => {
        const btn = fixture.debugElement.query(By.css('#btn_delete'));
        return expect(btn).toBeFalsy();
      });

      it('should navigate to last contract details when last contract link is pressed', async () => {
        const href = fixture.debugElement.query(By.css('#lnk_lastContract')).nativeElement.getAttribute('href');
        return expect(href).toEqual(`/invoicing/contracts/${component.summary.lastContractId}`);
      });

      it('should navigate to last invoice details when last invoice link is pressed', async () => {
        const href = fixture.debugElement.query(By.css('#lnk_lastInvoice')).nativeElement.getAttribute('href');
        return expect(href).toEqual(`/invoicing/invoices/${component.summary.lastInvoiceId}`);
      });

      it('should navigate to receiver details when details button is pressed', async () => {
        const href = fixture.debugElement.query(By.css('#btn_details')).nativeElement.getAttribute('href');
        return expect(href).toEqual(`/invoicing/receivers/${component.summary.object.header.id}`);
      });

      it('should invoke onCopy handler when copy button is pressed', async () => {
        const spy = jest.spyOn(component, 'onCopy');
        fixture.debugElement.query(By.css('#btn_copy')).triggerEventHandler('click', null);
        return expect(spy).toHaveBeenCalled();
      });
    });

    describe('When component is initially displayed for a deletable contract', () => {

      beforeEach(() => {
        component.summary = {...mockReceiverSummary(), deletable: true };
        fixture.detectChanges();
      });

      it(`should show the delete button if contract is deletable`, async () => {
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
