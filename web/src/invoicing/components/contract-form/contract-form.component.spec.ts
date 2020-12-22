import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContractFormComponent} from './contract-form.component';
import {ContractsBusinessService} from '../../business-services';
import {AppState} from '../../../app/store';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import {SharedModule} from '../../../shared/shared.module';
import {mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {mockAllReceivers, mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {mockAllInvoices} from '../../../test/factories/mock-invoices.factory';
import {By} from '@angular/platform-browser';
import {DatePipe, DecimalPipe, registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {ContractFactory, InvoiceFactory, ReceiverFactory} from 'jovisco-domain';

describe('Contract Details Form Component', () => {

  let component: ContractFormComponent;
  let fixture: ComponentFixture<ContractFormComponent>;
  let service: ContractsBusinessService;
  let store: Store<AppState>;
  let utility: I18nUtilityService;
  let decimalPipe: DecimalPipe;
  let datePipe: DatePipe;

  beforeEach(async () => {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [ContractFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        DatePipe,
        DecimalPipe,
        {
          provide: ContractsBusinessService,
          useValue: {
            change: jest.fn(),
            copy: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            new: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => of(mockAuth()[0])),
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
    service = TestBed.inject(ContractsBusinessService);
    utility = TestBed.inject(I18nUtilityService);
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ContractFormComponent);
    decimalPipe = TestBed.inject(DecimalPipe);
    datePipe = TestBed.inject(DatePipe);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.object = ContractFactory.fromData(mockSingleContract());
      component.isChangeable = true;
      component.receivers = ReceiverFactory.fromDataArray(mockAllReceivers());
      component.contractPartner = ReceiverFactory.fromData(mockSingleReceiver());
      component.allInvoices = mockAllInvoices()
        .filter(i => i.receiverId === component.object.header.customerId)
        .map(i => InvoiceFactory.fromData(i));
      component.openInvoices = component.allInvoices.slice(0, 5);
      component.form = undefined;
      component.ngOnChanges({});
    });

    it('should return the title', () => {
      expect(component.getFormTitle()).toContain(`${component.object.header.id} - ${component.object.header.description }`);
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
      expect(component.form.controls['customerId'].value).toEqual(component.contractPartner.header.id);
      expect(component.form.controls['issuedAt'].value).toEqual(component.object.header.issuedAt);
      expect(component.form.controls['description'].value).toEqual(component.object.header.description);
      expect(component.form.controls['startDate'].value).toEqual(component.object.term.startDate);
      expect(component.form.controls['endDate'].value).toEqual(component.object.term.endDate);
      let expected = decimalPipe.transform(component.object.header.budget, '1.2-2', 'de-DE');
      expect(component.form.controls['budget'].value).toEqual(expected);
      expect(component.form.controls['currency'].value).toEqual(component.object.header.currency);
      expect(component.form.controls['billingMethod'].value).toEqual(component.object.header.billingMethod);
      expect(component.form.controls['paymentMethod'].value).toEqual(component.object.header.paymentMethod);
      expect(component.form.controls['paymentTerms'].value).toEqual(component.object.header.paymentTerms);
      expect(component.form.controls['cashDiscountDays'].value).toEqual(component.object.header.cashDiscountDays);
      expected = decimalPipe.transform(component.object.header.cashDiscountPercentage, '1.1-2', 'de-DE');
      expect(component.form.controls['cashDiscountPercentage'].value).toEqual(expected);
      expect(component.form.controls['dueDays'].value).toEqual(component.object.header.dueDays);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.object = ContractFactory.fromData(mockSingleContract());
      component.isChangeable = true;
      component.receivers = ReceiverFactory.fromDataArray(mockAllReceivers());
      component.contractPartner = ReceiverFactory.fromData(mockSingleReceiver());
      component.allInvoices = mockAllInvoices()
        .filter(i => i.receiverId === component.object.header.customerId)
        .map(i => InvoiceFactory.fromData(i));
      component.openInvoices = component.allInvoices.slice(0, 5);
      component.task = 'edit';
      component.form = undefined;
      component.ngOnChanges({});
      // component.form.controls['items'].clearValidators();
      // fixture.detectChanges();
    });

    describe('when contract from is initially displayed in edit mode', () => {

      beforeEach(() => {
        component.form.controls['items'].clearValidators();
        fixture.detectChanges();
      });

      it('should show the tabs for details, texts, documents, open invoices and invoices', () => {
        const tabs = fixture.debugElement.query(By.css('.mat-tab-labels')).children;
        expect(tabs).toHaveLength(5);
      });

      describe('Buttons', () => {

        it('should show the buttons cancel, new, copy on the details and the text tab', () => {
          let btn = fixture.debugElement.query(By.css('#btn_cancel'));
          expect(btn).toBeTruthy();
          btn = fixture.debugElement.query(By.css('#btn_new'));
          expect(btn).toBeTruthy();
          btn = fixture.debugElement.query(By.css('#btn_copy'));
          expect(btn).toBeTruthy();
        });

        it('should show the button new invoice on the details tab if the contract is invoiceable', () => {
          const btn = fixture.debugElement.query(By.css('#btn_newinvoice'));
          expect(btn).toBeTruthy();
        });

        it('should show the button delete on the details tab if the contract is deletable', () => {
          component.isChangeable = true;
          fixture.detectChanges();
          const btn = fixture.debugElement.query(By.css('#btn_delete'));
          expect(btn).toBeTruthy();
        });
      });
    });


    describe('when contract form has been edited', () => {


      it('should show an error if a mandatory field is not entered', () => {
        const mandatoryFields = ['issuedAt', 'description', 'customerId', 'startDate', 'endDate', 'currency',
          'billingMethod', 'paymentMethod', 'paymentTerms', 'dueDays'];
        mandatoryFields.forEach(name => {
          const field = component.form.controls[name];
          field.setValue(null);
          const errors = field.errors || {};
          expect(errors['required']).toBeTruthy();
        });
      });

      it('should show an error if numeric field is not entered correctly', () => {
        const numericFields = ['budget', 'cashDiscountDays', 'cashDiscountPercentage', 'dueDays'];
        numericFields.forEach(name => {
          const field = component.form.controls[name];
          field.setValue('12ab');
          const errors = field.errors || {};
          expect(errors['pattern']).toBeTruthy();
        });
      });

      it('should show an error if no items have been entered', () => {
        const items = component.form.controls['items'];
        const errors = items.errors || {};
        expect(errors['minItems']).toBeTruthy();
      });

      describe('Buttons', () => {

        beforeEach(() => {
          component.form.controls['items'].clearValidators();
          fixture.detectChanges();
        });

        it('should only enable the cancel button if there are any errors on the form', () => {
          component.isChangeable = false;
          component.form.controls['customerId'].setValue(null);
          fixture.detectChanges();
          const buttons = fixture.debugElement.query(By.css('div .jo-btn-row')).children;
          const enabled = buttons
            .map(b => b.nativeElement as HTMLButtonElement)
            .filter(b => b.disabled === false);
          expect(enabled.length).toBe(1);
        });

        it('should enable cancel, delete and save buttons if there are no errors on the edited form', () => {
          component.form.markAsDirty();
          component.isChangeable = true;
          fixture.detectChanges();
          const buttons = fixture.debugElement.query(By.css('div .jo-btn-row')).children;
          const enabled = buttons
            .map(b => b.nativeElement as HTMLButtonElement)
            .filter(b => b.disabled === false);
          expect(enabled.length).toBe(3);
          expect(enabled[0].getAttribute('id')).toEqual('btn_cancel');
          expect(enabled[1].getAttribute('id')).toEqual('btn_delete');
          expect(enabled[2].getAttribute('id')).toEqual('btn_save');
        });

        it('should show the button new invoice on the details tab if the contract is invoiceable', () => {
          const btn = fixture.debugElement.query(By.css('#btn_newinvoice'));
          expect(btn).toBeTruthy();
        });

        it('should show the button delete on the details tab if the contract is deletable', () => {
          component.isChangeable = true;
          fixture.detectChanges();
          const btn = fixture.debugElement.query(By.css('#btn_delete'));
          expect(btn).toBeTruthy();
        });
      });
    });
  });
});



