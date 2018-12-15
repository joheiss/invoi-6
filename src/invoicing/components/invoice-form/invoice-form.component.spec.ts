import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InvoicesBusinessService} from '../../business-services';
import {AppState} from '../../../app/store/reducers';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import {SharedModule} from '../../../shared/shared.module';
import {Contract} from '../../models/contract.model';
import {mockAllContracts, mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {Receiver} from '../../models/receiver.model';
import {mockAllReceivers, mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {mockSingleInvoice} from '../../../test/factories/mock-invoices.factory';
import {Invoice} from '../../models/invoice.model';
import {By} from '@angular/platform-browser';
import {DatePipe, DecimalPipe, registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {InvoiceFormComponent} from './invoice-form.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {of} from 'rxjs/index';

describe('Invoice Details Form Component', () => {

  let component: InvoiceFormComponent;
  let fixture: ComponentFixture<InvoiceFormComponent>;
  let service: InvoicesBusinessService;
  let store: Store<AppState>;
  let utility: I18nUtilityService;
  let decimalPipe: DecimalPipe;
  let datePipe: DatePipe;

  beforeEach(async () => {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [InvoiceFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        { provide: DateAdapter, useClass: MomentDateAdapter },

        DecimalPipe,
        DatePipe,
        {
          provide: InvoicesBusinessService,
          useValue: {
            change: jest.fn(),
            copy: jest.fn(),
            create: jest.fn(),
            createPdf: jest.fn(),
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
    service = TestBed.get(InvoicesBusinessService);
    utility = TestBed.get(I18nUtilityService);
    store = TestBed.get(Store);
    decimalPipe = TestBed.get(DecimalPipe);
    datePipe = TestBed.get(DatePipe);
    fixture = TestBed.createComponent(InvoiceFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.object = Invoice.createFromData(mockSingleInvoice());
      component.invoiceReceiver = Receiver.createFromData(mockSingleReceiver());
      component.invoiceContract = Contract.createFromData(mockSingleContract());
      component.isChangeable = true;
      component.isSendable = true;
      component.receivers = mockAllReceivers().map(r => Receiver.createFromData(r));
      component.contracts = mockAllContracts().map(c => Contract.createFromData(c));
      component.mode = 'edit';
      component.form = undefined;
      component.ngOnChanges({});
    });

    it('should return the title', () => {
      expect(component.getFormTitle()).toContain(`${component.object.header.id}`);
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
      expect(component.form.controls['status'].value).toEqual(component.object.header.status.toString());
      expect(component.form.controls['issuedAt'].value).toEqual(component.object.header.issuedAt);
      expect(component.form.controls['receiverId'].value).toEqual(component.object.header.receiverId);
      expect(component.form.controls['billingPeriod'].value).toEqual(component.object.header.billingPeriod);
      expect(component.form.controls['contractId'].value).toEqual(component.object.header.contractId);
      expect(component.form.controls['billingMethod'].value).toEqual(component.object.header.billingMethod);
      expect(component.form.controls['currency'].value).toEqual(component.object.header.currency);
      let expected = decimalPipe.transform(component.object.header.vatPercentage, '1.1-2', 'de-DE');
      expect(component.form.controls['vatPercentage'].value).toEqual(expected);
      expect(component.form.controls['paymentTerms'].value).toEqual(component.object.header.paymentTerms);
      expect(component.form.controls['paymentMethod'].value).toEqual(component.object.header.paymentMethod);
      expect(component.form.controls['cashDiscountDays'].value).toEqual(component.object.header.cashDiscountDays);
      expected = decimalPipe.transform(component.object.header.cashDiscountPercentage, '1.1-2',  'de-DE');
      expect(component.form.controls['cashDiscountPercentage'].value).toEqual(expected);
      expect(component.form.controls['dueInDays'].value).toEqual(component.object.header.dueInDays);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.object = Invoice.createFromData(mockSingleInvoice());
      component.invoiceReceiver = Receiver.createFromData(mockSingleReceiver());
      component.invoiceContract = Contract.createFromData(mockSingleContract());
      component.isChangeable = true;
      component.isSendable = true;
      component.receivers = mockAllReceivers().map(r => Receiver.createFromData(r));
      component.contracts = mockAllContracts().map(c => Contract.createFromData(c));
      component.mode = 'edit';
      component.form = undefined;
      component.ngOnChanges({});
    });

    describe('when invoice from is initially displayed in edit mode', () => {

      beforeEach(() => {
        component.form.controls['items'].clearValidators();
        fixture.detectChanges();
      });

      it('should show the tabs for details, texts and documents', () => {
        const tabs = fixture.debugElement.query(By.css('.mat-tab-labels')).children;
        expect(tabs).toHaveLength(3);
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

        it('should show the button create Pdf if invoice has not yet been sent or paid', () => {
          const btn = fixture.debugElement.query(By.css('#btn_createPdf'));
          expect(btn).toBeTruthy();
        });

        it('should show the button send invoice if invoice is sendable', () => {
          const btn = fixture.debugElement.query(By.css('#btn_send'));
          expect(btn).toBeTruthy();
        });

        it('should show the button delete if the invoice is deletable', () => {
          component.isChangeable = true;
          fixture.detectChanges();
          const btn = fixture.debugElement.query(By.css('#btn_delete'));
          expect(btn).toBeTruthy();
        });
      });
    });


    describe('when contract form has been edited', () => {


      it('should show an error if a mandatory field is not entered', () => {
        const mandatoryFields = ['status', 'issuedAt', 'receiverId', 'billingPeriod', 'contractId', 'currency',
          'billingMethod', 'paymentMethod', 'paymentTerms', 'dueInDays'];
        mandatoryFields.forEach(name => {
          const field = component.form.controls[name];
          field.setValue(null);
          const errors = field.errors || {};
          expect(errors['required']).toBeTruthy();
        });
      });

      it('should show an error if numeric field is not entered correctly', () => {
        const numericFields = ['vatPercentage', 'cashDiscountDays', 'cashDiscountPercentage', 'dueInDays'];
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

        it('should only enable the cancel and delete button if there are any errors on the form', () => {
          component.isChangeable = true;
          component.form.controls['receiverId'].setValue(null);
          fixture.detectChanges();
          const buttons = fixture.debugElement.query(By.css('div .jo-btn-row')).children;
          const enabled = buttons
            .map(b => b.nativeElement as HTMLButtonElement)
            .filter(b => b.disabled === false);
          expect(enabled.length).toBe(2);
          expect(enabled[0].getAttribute('id')).toEqual('btn_cancel');
          expect(enabled[1].getAttribute('id')).toEqual('btn_delete');
        });

        it('should enable cancel, delete and save buttons if there are no errors on the edited (dirty) form', () => {
          component.form.markAsDirty();
          component.isChangeable = true;
          component.isSendable = false;
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

        it('should show the button send invoice if the invoice is sendable', () => {
          component.isChangeable = true;
          component.isSendable = true;
          fixture.detectChanges();
          const btn = fixture.debugElement.query(By.css('#btn_send'));
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



