import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {OpenInvoiceListComponent} from './open-invoice-list.component';
import {mockAllOpenInvoices} from '../../../test/factories/mock-open-invoices.factory';

describe('Open Invoice List Component', () => {

  let component: OpenInvoiceListComponent;
  let fixture: ComponentFixture<OpenInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [OpenInvoiceListComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenInvoiceListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.objects = mockAllOpenInvoices();
      component.ngOnChanges();
    });

    it('should provide the open invoices in the data source for the table', async () => {
      expect(component.objects.length).toBe(5);
      expect(component.dataSource.data).toHaveLength(component.objects.length);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.objects = mockAllOpenInvoices();
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should show a table with header line and 5 lines with open invoices', async () => {
      let de: DebugElement;
      de = fixture.debugElement.query(By.css('mat-table'));
      await expect(de).toBeTruthy();
      const count = de.children.length;
      await expect(count).toBe(6);
      de = fixture.debugElement.query(By.css('mat-table mat-header-row'));
      await expect(de).toBeTruthy();
    });

    it('should navigate to item details when contract id link button is pressed', async () => {
      const href = fixture.debugElement.query(By.css('a')).nativeElement.getAttribute('href');
      return expect(href).toEqual(`/invoicing/invoices/${component.objects[0].id}`);
    });

  });
});


