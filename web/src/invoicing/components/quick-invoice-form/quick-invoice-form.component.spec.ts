import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppState} from '../../../app/store';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import {SharedModule} from '../../../shared/shared.module';
import {mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {By} from '@angular/platform-browser';
import {DatePipe, DecimalPipe, registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {QuickInvoiceFormComponent} from './quick-invoice-form.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {Contract, ContractFactory, Invoice, InvoiceFactory, ReceiverFactory} from 'jovisco-domain';

describe('Quick Invoice Form Component', () => {

  let component: QuickInvoiceFormComponent;
  let fixture: ComponentFixture<QuickInvoiceFormComponent>;
  let store: Store<AppState>;
  let utility: I18nUtilityService;
  let decimalPipe: DecimalPipe;
  let datePipe: DatePipe;

  beforeEach(async () => {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [QuickInvoiceFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        DecimalPipe,
        DatePipe,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn()
          }
        },
        {
          provide: I18nUtilityService,
          useValue: {
            fromLocalAmount: jest.fn((amount: any) => {
              if (!amount) {
                return 0;
              }
              if (typeof amount !== 'string') {
                return amount;
              }

              const toBeConverted = amount
                .replace(new RegExp('.'.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '')
                .replace(new RegExp(','.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '.');
              return parseFloat(toBeConverted);
            }),
            fromLocalPercent: jest.fn((amount: any) => {
              if (!amount) {
                return 0;
              }
              if (typeof amount !== 'string') {
                return amount;
              }

              const toBeConverted = amount
                .replace(new RegExp('.'.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '')
                .replace(new RegExp(','.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '.');
              return parseFloat(toBeConverted);
            }),
            toLocalAmount: jest.fn((amount: number) => {
              if (isNaN(amount)) {
                return null;
              }
              return decimalPipe.transform(amount, '1.2-2', 'de-DE');
            }),
            toLocalPercent: jest.fn((percent: number) => {
              if (!percent && percent !== 0) {
                return null;
              }
              return decimalPipe.transform(percent, '1.1-3', 'de-DE');
            })
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    // registerLocaleData(localeDe, 'de-DE', localeDeExtra);
    utility = TestBed.inject(I18nUtilityService);
    store = TestBed.inject(Store);
    decimalPipe = TestBed.inject(DecimalPipe);
    datePipe = TestBed.inject(DatePipe);
    fixture = TestBed.createComponent(QuickInvoiceFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {

      component.invoiceReceiver = ReceiverFactory.fromData(mockSingleReceiver());
      component.invoiceContract = ContractFactory.fromData(mockSingleContract());
      component.object = mockNewInvoiceFromContract(component.invoiceContract);
      component.form = undefined;
      component.ngOnChanges({});
    });

    it('should build and patch the form and listen to changes when the form is initially built', async () => {
      component.form = undefined;
      const spyBuild = jest.spyOn<any, any>(component, 'buildForm');
      const spyPatch = jest.spyOn<any, any>(component, 'patchForm');
      const spyListen = jest.spyOn<any, any>(component, 'listenToChanges');
      await component.ngOnChanges({});
      await expect(spyBuild).toHaveBeenCalled();
      await expect(spyPatch).toHaveBeenCalled();
      return expect(spyListen).toHaveBeenCalled();
    });

    it('should only patch the form in case of changes when the form has already been built', async () => {
      const spyBuild = jest.spyOn<any, any>(component, 'buildForm');
      const spyPatch = jest.spyOn<any, any>(component, 'patchForm');
      const spyListen = jest.spyOn<any, any>(component, 'listenToChanges');
      await component.ngOnChanges({});
      await expect(spyBuild).not.toHaveBeenCalled();
      await expect(spyPatch).toHaveBeenCalled();
      return expect(spyListen).not.toHaveBeenCalled();
    });

    it('should provide the correct values in the form controls', async () => {
      expect(component.form.controls['issuedAt'].value).toEqual(component.object.header.issuedAt);
      expect(component.form.controls['billingPeriod'].value).toEqual(component.object.header.billingPeriod);
      const expected = decimalPipe.transform(component.object.items[0].quantity, '1.2-2', 'de-DE');
      expect(component.form.controls['quantity'].value).toEqual(expected);
      expect(component.form.controls['description'].value).toEqual(component.object.items[0].description);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.invoiceReceiver = ReceiverFactory.fromData(mockSingleReceiver());
      component.invoiceContract = ContractFactory.fromData(mockSingleContract());
      component.object = mockNewInvoiceFromContract(component.invoiceContract);
      component.form = undefined;
      component.ngOnChanges({});
      fixture.detectChanges();
    });

    describe('when invoice from is initially displayed in edit mode', () => {

      beforeEach(() => {
      });

      it('should show the receiver and contract', () => {
        const des = fixture.debugElement.queryAll(By.css('input'));
        let inp = des[0].nativeElement as HTMLInputElement;
        expect(inp.value).toContain(`${component.object.header.receiverId}`);
        expect(inp.value).toContain(`${component.invoiceReceiver.header.name}`);
        inp = des[1].nativeElement as HTMLInputElement;
        expect(inp.value).toContain(`${component.object.header.contractId}`);
        expect(inp.value).toContain(`${component.invoiceContract.header.description}`);
      });

      describe('Buttons', () => {

        it('should show the buttons cancel and save - save disabled if form is not dirty or has errors', () => {
          let de = fixture.debugElement.query(By.css('#btn_cancel'));
          expect(de).toBeTruthy();
          de = fixture.debugElement.query(By.css('#btn_save'));
          expect(de).toBeTruthy();
          const btn = de.nativeElement as HTMLButtonElement;
          expect(btn.disabled).toBeTruthy();
        });
      });

    });
    describe('when quick invoice form has been edited', () => {


      it('should show an error if a mandatory field is not entered', () => {
        const mandatoryFields = ['issuedAt', 'billingPeriod', 'quantity', 'description'];
        mandatoryFields.forEach(name => {
          const field = component.form.controls[name];
          field.setValue(null);
          const errors = field.errors || {};
          expect(errors['required']).toBeTruthy();
        });
      });

      it('should show an error if numeric field is not entered correctly', () => {
        const numericFields = ['quantity'];
        numericFields.forEach(name => {
          const field = component.form.controls[name];
          field.setValue('12ab');
          const errors = field.errors || {};
          expect(errors['pattern']).toBeTruthy();
        });
      });

      describe('Buttons', () => {

        it('should disable the save button if there are errors on the form', () => {
          component.form.markAsDirty();
          fixture.detectChanges();
          const btn = fixture.debugElement.query(By.css('#btn_save')).nativeElement as HTMLButtonElement;
          expect(btn.disabled).toBeTruthy();
        });

        it('should only enable the save button if something has been entered and there are no errors on the form', () => {
          component.form.controls['billingPeriod'].setValue('Heute');
          component.form.controls['quantity'].setValue('1');
          component.form.markAsDirty();
          fixture.detectChanges();
          const btn = fixture.debugElement.query(By.css('#btn_save')).nativeElement as HTMLButtonElement;
          expect(btn.disabled).toBeFalsy();
        });
      });
    });
  });
});

const mockNewInvoiceFromContract = (contract: Contract): Invoice => {
  const data = Object.assign({}, Invoice.defaultValues());
  data.receiverId = contract.header.customerId;
  data.contractId = contract.header.id;
  data.billingMethod = contract.header.billingMethod;
  data.currency = contract.header.currency;
  data.cashDiscountDays = contract.header.cashDiscountDays;
  data.cashDiscountPercentage = contract.header.cashDiscountPercentage;
  data.dueInDays = contract.header.dueDays;
  data.paymentTerms = contract.header.paymentTerms;
  data.paymentMethod = contract.header.paymentMethod;
  data.invoiceText = contract.header.invoiceText;
  data.vatPercentage = 19.0;
  data.items = [];
  const item = contract.items[0];
  data.items.push({
    id: 1,
    contractItemId: item.id,
    description: item.description,
    quantityUnit: item.priceUnit,
    pricePerUnit: item.pricePerUnit,
    cashDiscountAllowed: item.cashDiscountAllowed
  });
  return InvoiceFactory.fromData(data);
};



