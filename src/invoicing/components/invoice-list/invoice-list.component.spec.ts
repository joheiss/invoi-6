import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {InvoiceListComponent} from './invoice-list.component';
import {mockAllInvoices} from '../../../test/factories/mock-invoices.factory';
import {Invoice} from '../../models/invoice.model';

describe('Invoice List Component', () => {

  let component: InvoiceListComponent;
  let fixture: ComponentFixture<InvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [InvoiceListComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.objects = mockAllInvoices().slice(0, 10).map(i => Invoice.createFromData(i));
      component.ngOnChanges();
    });

    it('should provide the contracts in the data source for the table', async () => {
      expect(component.objects.length).toBe(10);
      expect(component.dataSource.data).toHaveLength(component.objects.length);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.objects = mockAllInvoices().slice(0, 10).map(i => Invoice.createFromData(i));
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should show a table with header line and 10 lines with invoices', async () => {
      let de: DebugElement;
      de = fixture.debugElement.query(By.css('mat-table'));
      await expect(de).toBeTruthy();
      const count = de.children.length;
      await expect(count).toBe(11);
      de = fixture.debugElement.query(By.css('mat-table mat-header-row'));
      await expect(de).toBeTruthy();
    });

    it('should navigate to item details when contract id link button is pressed', async () => {
      const href = fixture.debugElement.query(By.css('a')).nativeElement.getAttribute('href');
      return expect(href).toEqual(`/invoicing/invoices/${component.objects[0].header.id}`);
    });

  });
});


