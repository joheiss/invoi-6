import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContractFormComponent} from './contract-form.component';
import {ContractsBusinessService} from '../../business-services';
import {AppState} from '../../../app/store/reducers';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import {SharedModule} from '../../../shared/shared.module';
import {Contract} from '../../models/contract.model';
import {mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {Receiver} from '../../models/receiver.model';
import {mockAllReceivers, mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {mockAllInvoices} from '../../../test/factories/mock-invoices.factory';
import {Invoice} from '../../models/invoice.model';
import {By} from '@angular/platform-browser';
import {DatePipe, DecimalPipe, registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {MatExpansionPanel} from '@angular/material';

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
    service = TestBed.get(ContractsBusinessService);
    utility = TestBed.get(I18nUtilityService);
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(ContractFormComponent);
    decimalPipe = TestBed.get(DecimalPipe);
    datePipe = TestBed.get(DatePipe);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.object = Contract.createFromData(mockSingleContract());
      component.isChangeable = true;
      component.receivers = mockAllReceivers().map(r => Receiver.createFromData(r));
      component.contractPartner = Receiver.createFromData(mockSingleReceiver());
      component.allInvoices = mockAllInvoices()
        .filter(i => i.receiverId === component.object.header.customerId)
        .map(i => Invoice.createFromData(i));
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

  });

  describe('View', () => {

    beforeEach(() => {
      component.object = Contract.createFromData(mockSingleContract());
      component.isChangeable = true;
      component.receivers = mockAllReceivers().map(r => Receiver.createFromData(r));
      component.contractPartner = Receiver.createFromData(mockSingleReceiver());
      component.allInvoices = mockAllInvoices()
        .filter(i => i.receiverId === component.object.header.customerId)
        .map(i => Invoice.createFromData(i));
      component.openInvoices = component.allInvoices.slice(0, 5);
      component.task = 'edit';
      component.form = undefined;
      component.ngOnChanges({});
      component.form.controls['items'].clearValidators();
      fixture.detectChanges();
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

      describe('Details Tab', () => {

        it('should show the panels for main, payment terms and items on the details tab', () => {
          const panels = fixture.debugElement.queryAll(By.css('#mat-tab-content-0-0 .mat-tab-body-content mat-expansion-panel'));
          expect(panels).toHaveLength(3);
        });

        it('should show the contract partner on the main panel', () => {
          const customer = fixture.debugElement.query(By.css('#customerId')).nativeElement as HTMLSelectElement;
          expect(customer.value).toEqual(component.contractPartner.id);
        });

        it('should show the issuing date on the main panel', () => {
          const issuedAt = fixture.debugElement.query(By.css('input[formControlName="issuedAt"]')).nativeElement as HTMLInputElement;
          const expected = datePipe.transform(component.object.header.issuedAt, 'M/d/y');
          expect(issuedAt.value).toEqual(expected);
        });

        it('should show the contract title on the main panel', () => {
          const title = fixture.debugElement.query(By.css('#description')).nativeElement as HTMLInputElement;
          expect(title.value).toEqual(component.object.header.description);
        });

        it('should show the contract start and end date on the main panel', () => {
          let date = fixture.debugElement.query(By.css('#startDate')).nativeElement as HTMLInputElement;
          let expected = datePipe.transform(component.object.header.startDate, 'M/d/y');
          expect(date.value).toEqual(expected);
          date = fixture.debugElement.query(By.css('#endDate')).nativeElement as HTMLInputElement;
          expected = datePipe.transform(component.object.header.endDate, 'M/d/y');
          expect(date.value).toEqual(expected);
        });

        it('should show the contract budget on the main panel', () => {
          const budget = fixture.debugElement.query(By.css('#budget')).nativeElement as HTMLInputElement;
          const expected = decimalPipe.transform(component.object.header.budget,  '1.2-2', 'de-DE');
          expect(budget.value).toEqual(expected);
        });

        it('should show the contract currency on the main panel', () => {
          const currency = fixture.debugElement.query(By.css('#currency')).nativeElement as HTMLInputElement;
          expect(currency.value).toEqual(component.object.header.currency);
        });

        it('should show the billing method on the payments panel', () => {
          fixture.debugElement.query(By.css('#pnl_paymentTerms')).triggerEventHandler('click', null);
          fixture.detectChanges();
          const billingMethod = fixture.debugElement.query(By.css('#billingMethod')).nativeElement as HTMLSelectElement;
          console.log('billingMethod: ', billingMethod);
          expect(billingMethod.value).toEqual(component.object.header.billingMethod);
        });

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
  });
});



