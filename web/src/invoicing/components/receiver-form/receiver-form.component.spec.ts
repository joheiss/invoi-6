import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ReceiversBusinessService} from '../../business-services';
import {AppState} from '../../../app/store/reducers';
import {SharedModule} from '../../../shared/shared.module';
import {mockAllContracts} from '../../../test/factories/mock-contracts.factory';
import {mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {mockAllInvoices} from '../../../test/factories/mock-invoices.factory';
import {By} from '@angular/platform-browser';
import {ReceiverFormComponent} from './receiver-form.component';
import {mockAllCountries} from '../../../test/factories/mock-settings.factory';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {ContractFactory, InvoiceFactory, ReceiverFactory} from 'jovisco-domain';

describe('Receiver Details Form Component', () => {

  let component: ReceiverFormComponent;
  let fixture: ComponentFixture<ReceiverFormComponent>;
  let service: ReceiversBusinessService;
  let store: Store<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [ReceiverFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ReceiversBusinessService,
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
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.get(ReceiversBusinessService);
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(ReceiverFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.object = ReceiverFactory.fromData(mockSingleReceiver());
      component.isDeletable = false;
      component.activeContracts = mockAllContracts()
        .filter(c => c.customerId === component.object.header.id)
        .slice(0, 2)
        .map(c => ContractFactory.fromData(c));
      component.lastContracts = component.activeContracts.slice(0, 1);
      component.openInvoices = mockAllInvoices()
        .filter(i => i.receiverId === component.object.header.id)
        .slice(0, 2)
        .map(i => InvoiceFactory.fromData(i));
      component.lastInvoices = component.openInvoices.slice(0, 1);
      component.task = 'edit';
      component.countries = mockAllCountries().values;
      component.form = undefined;
      component.ngOnChanges({});
    });

    it('should return the title', () => {
      expect(component.getFormTitle()).toContain(`${component.object.header.id} - ${component.object.header.name }`);
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
      expect(component.form.controls['id'].value).toEqual(component.object.header.id);
      expect(component.form.controls['status'].value).toEqual(component.object.header.status.toString());
      expect(component.form.controls['name'].value).toEqual(component.object.header.name);
      expect(component.form.controls['nameAdd'].value).toEqual(component.object.header.nameAdd);
      expect(component.form.controls['country'].value).toEqual(component.object.address.country);
      expect(component.form.controls['postalCode'].value).toEqual(component.object.address.postalCode);
      expect(component.form.controls['city'].value).toEqual(component.object.address.city);
      expect(component.form.controls['street'].value).toEqual(component.object.address.street);
      expect(component.form.controls['email'].value).toEqual(component.object.address.email);
      expect(component.form.controls['phone'].value).toEqual(component.object.address.phone);
      expect(component.form.controls['fax'].value).toEqual(component.object.address.fax);
      expect(component.form.controls['webSite'].value).toEqual(component.object.address.webSite);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.object = ReceiverFactory.fromData(mockSingleReceiver());
      component.isDeletable = false;
      component.activeContracts = mockAllContracts()
        .filter(c => c.customerId === component.object.header.id)
        .slice(0, 2)
        .map(c => ContractFactory.fromData(c));
      component.lastContracts = component.activeContracts.slice(0, 1);
      component.openInvoices = mockAllInvoices()
        .filter(i => i.receiverId === component.object.header.id)
        .slice(0, 2)
        .map(i => InvoiceFactory.fromData(i));
      component.lastInvoices = component.openInvoices.slice(0, 1);
      component.task = 'edit';
      component.countries = mockAllCountries().values;
      component.form = undefined;
      component.ngOnChanges({});
    });

    describe('when receiver from is initially displayed in edit mode', () => {

      beforeEach(() => {
        component.isQualForQuickInvoice = true;
        component.form.clearValidators();
        fixture.detectChanges();
      });

      it('should show the tabs for details, texts, documents, recent contracts and recent invoices', () => {
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

        it('should show the button new invoice on the details tab if the receiver is qualified for quick invoices', () => {
          const btn = fixture.debugElement.query(By.css('#btn_quickInvoice'));
          expect(btn).toBeTruthy();
        });

        it('should show the button delete if the receiver is deletable', () => {
          component.isDeletable = true;
          fixture.detectChanges();
          const btn = fixture.debugElement.query(By.css('#btn_delete'));
          expect(btn).toBeTruthy();
        });
      });
    });

    describe('when contract form has been edited', () => {

      beforeEach(() => {
        component.task = 'edit';
        fixture.detectChanges();
      });

      it('should show an error if a mandatory field is not entered', () => {
        const mandatoryFields = ['name', 'postalCode', 'city'];
        mandatoryFields.forEach(name => {
          const field = component.form.controls[name];
          field.setValue(null);
          const errors = field.errors || {};
          expect(errors['required']).toBeTruthy();
        });
      });

      it('should show an error if special format field is not entered correctly', () => {
        const numericFields = ['email', 'phone', 'fax', 'webSite'];
        numericFields.forEach(name => {
          const field = component.form.controls[name];
          field.setValue('12ab');
          const errors = field.errors || {};
          expect(errors['pattern']).toBeTruthy();
        });
      });

      describe('Buttons', () => {

        it('should only enable the cancel button if there are any errors on the form', () => {
          component.isDeletable = false;
          component.form.controls['name'].setValue(null);
          fixture.detectChanges();
          const buttons = fixture.debugElement.query(By.css('div .jo-btn-row')).children;
          const enabled = buttons
            .map(b => b.nativeElement as HTMLButtonElement)
            .filter(b => b.disabled === false);
          expect(enabled.length).toBe(1);
        });

        it('should enable cancel, delete and save buttons if there are no errors on the edited form', () => {
          component.form.markAsDirty();
          component.isDeletable = true;
          component.isQualForQuickInvoice = false;
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

        it('should show the quick invoice button if the receiver is qualified for quick invoices', () => {
          component.isQualForQuickInvoice = true;
          fixture.detectChanges();
          const btn = fixture.debugElement.query(By.css('#btn_quickInvoice'));
          expect(btn).toBeTruthy();
        });

        it('should show the button delete on the details tab if the contract is deletable', () => {
          component.isDeletable = true;
          fixture.detectChanges();
          const btn = fixture.debugElement.query(By.css('#btn_delete'));
          expect(btn).toBeTruthy();
        });
      });
    });
  });
});



