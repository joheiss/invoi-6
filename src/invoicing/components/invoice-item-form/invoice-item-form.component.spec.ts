import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import {SharedModule} from '../../../shared/shared.module';
import {DatePipe, DecimalPipe, registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {mockI18nUtility} from '../../../test/objects/mock-i18n-utility';
import {By} from '@angular/platform-browser';
import {Invoice} from '../../models/invoice.model';
import {mockSingleInvoice} from '../../../test/factories/mock-invoices.factory';
import {InvoiceItemFormComponent} from './invoice-item-form.component';
import {mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {Contract} from '../../models/contract.model';
import {Store} from '@ngrx/store';
import {of} from 'rxjs/internal/observable/of';
import {mockAuth} from '../../../test/factories/mock-auth.factory';

describe('Invoice Item Form Component', () => {

  let component: InvoiceItemFormComponent;
  let fixture: ComponentFixture<InvoiceItemFormComponent>;
  let utility: I18nUtilityService;
  let decimalPipe: DecimalPipe;

  beforeEach(async () => {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [InvoiceItemFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        DatePipe,
        DecimalPipe,
        {
          provide: I18nUtilityService,
          useValue: mockI18nUtility()
        },
        {
          provide: Store,
          useValue: {
            pipe: jest.fn(() => of(mockAuth()[0])),
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    decimalPipe = TestBed.get(DecimalPipe);
    utility = TestBed.get(I18nUtilityService);
    fixture = TestBed.createComponent(InvoiceItemFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.itemGroup = new FormGroup({});
      component.item = Invoice.createFromData(mockSingleInvoice()).items[0];
      component['isItemGroupBuilt'] = false;
      component.ngOnChanges({});
    });

    it('should provide the correct values in the form controls', async () => {
      expect(component.itemGroup.controls['id'].value).toEqual(component.item.id);
      expect(component.itemGroup.controls['description'].value).toEqual(component.item.description);
      let expected = utility.toLocalAmount(component.item.pricePerUnit);
      expect(component.itemGroup.controls['pricePerUnit'].value).toEqual(expected);
      expected = utility.toLocalAmount(component.item.quantity);
      expect(component.itemGroup.controls['quantity'].value).toEqual(expected);
      expect(component.itemGroup.controls['quantityUnit'].value).toEqual(component.item.quantityUnit);
      expect(component.itemGroup.controls['cashDiscountAllowed'].value).toEqual(component.item.cashDiscountAllowed);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.itemGroup = new FormGroup({});
      component.item = Invoice.createFromData(mockSingleInvoice()).items[0];
      component.contract = Contract.createFromData(mockSingleContract());
      component.isChangeable = true;
      component['isItemGroupBuilt'] = false;
      component.ngOnChanges({});
      fixture.detectChanges();
    });

    it('should show the delete button if contract is changeable', async () => {
      const btn = fixture.debugElement.query(By.css('.invoice-item-action')).children[0];
      expect(btn).toBeTruthy();
    });

    it('should show an error message if mandatory field is not filled', async () => {
      const mandatoryFields = ['description', 'quantity', 'pricePerUnit', 'quantityUnit'];
      mandatoryFields.forEach(name => {
        const field = component.itemGroup.controls[name];
        field.setValue(null);
        const errors = field.errors || {};
        expect(errors['required']).toBeTruthy();
      });
    });

    it('should show an error if numeric field is not entered correctly', () => {
      const numericFields = ['quantity', 'pricePerUnit'];
      numericFields.forEach(name => {
        const field = component.itemGroup.controls[name];
        field.setValue('12ab');
        const errors = field.errors || {};
        expect(errors['pattern']).toBeTruthy();
      });
    });

    it('should invoke onDelete if delete button is pressed', async () => {
      const spy = jest.spyOn(component, 'onDelete');
      const btn = fixture.debugElement.query(By.css('.invoice-item-action'))
        .children[0]
        .nativeElement as HTMLButtonElement;
      btn.click();
      return expect(spy).toHaveBeenCalledWith(component.item.id);
    });
  });
});



