import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {InvoicesBusinessService} from '../../business-services';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {cold} from 'jasmine-marbles';
import {mockAllContracts, mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {mockAllReceivers, mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {mockSingleInvoice} from '../../../test/factories/mock-invoices.factory';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs/index';
import {InvoiceDetailsComponent} from './invoice-details.component';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {Store} from '@ngrx/store';
import {ContractFactory, Invoice, InvoiceFactory, ReceiverFactory} from 'jovisco-domain';

describe('Invoice Details Component', () => {

  let component: InvoiceDetailsComponent;
  let fixture: ComponentFixture<InvoiceDetailsComponent>;
  let service: InvoicesBusinessService;
  let route: ActivatedRoute;
  let invoice: Invoice;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [InvoiceDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: InvoicesBusinessService,
          useValue: {
            change: jest.fn(),
            copy: jest.fn(),
            create: jest.fn(),
            createPdf: jest.fn(),
            delete: jest.fn(),
            getContract: jest.fn(() => cold('-a|', { a: ContractFactory.fromData(mockSingleContract()) })),
            getContracts: jest.fn(() => cold('-a|', { a: mockAllContracts().map(c => ContractFactory.fromData(c)) })),
            getCurrent: jest.fn(() => cold('-a|', { a: InvoiceFactory.fromData(mockSingleInvoice()) })),
            getReceiver: jest.fn(() => cold('-a|', { a: ReceiverFactory.fromData(mockSingleReceiver()) })),
            getReceivers: jest.fn(() => cold('-a|', { a: mockAllReceivers().map(r => ReceiverFactory.fromData(r)) })),
            isChangeable: jest.fn(() => cold('-a|', { a: true })),
            isSendable: jest.fn(() => cold('-a|', { a: true })),
            isUserAllowedToEdit: jest.fn(() => true),
            new: jest.fn(),
            sendEmail: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: cold('-a|', {a: {get: () => '5995'}})
          }
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
    service = TestBed.get(InvoicesBusinessService);
    route = TestBed.get(ActivatedRoute);
    fixture = TestBed.createComponent(InvoiceDetailsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    component.invoice$ = of(InvoiceFactory.fromData((mockSingleInvoice())));
    fixture.detectChanges();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      invoice = InvoiceFactory.fromData(mockSingleInvoice());
    });

    it('should invoke service.createPdf if pdf is requested', () => {
      const spy = jest.spyOn(service, 'createPdf');
      component.onCreatePdf(invoice);
      expect(spy).toHaveBeenCalledWith(invoice);
    });

    it('should invoke service.sendEmail if email is requested', () => {
      const spy = jest.spyOn(service, 'sendEmail');
      component.onSendEmail(invoice);
      expect(spy).toHaveBeenCalledWith(invoice);
    });

    it('should return the correct title', () => {
      expect(component['getTitle'](invoice)).toContain(invoice.header.id);
      expect(component['getTitle'](invoice)).toContain(invoice.header.billingPeriod);
    });

    it('should initialize invoice, receiver, contract, all receivers and all contracts in any case', () => {
      component['initializeWithData']('something');
      fixture.detectChanges();
      let expected: any = cold('-a|', { a: InvoiceFactory.fromData(mockSingleInvoice()) });
      expect(component.invoice$).toBeObservable(expected);
      expected = cold('---a|', { a: ReceiverFactory.fromData(mockSingleReceiver()) });
      expect(component.invoiceReceiver$).toBeObservable(expected);
      expected = cold('-----a|', { a: ContractFactory.fromData(mockSingleContract()) });
      expect(component.invoiceContract$).toBeObservable(expected);
      expected = cold('-------a|', { a: mockAllReceivers().map(r => ReceiverFactory.fromData(r)) });
      expect(component.receivers$).toBeObservable(expected);
      expected = cold('---------a|', { a: mockAllContracts().map(c => ContractFactory.fromData(c)) });
      expect(component.contracts$).toBeObservable(expected);
    });

  });

  describe('View', () => {

    it('should embed the invoice form if task is edit, new or copy', async () => {
      component.task$.next('edit');
      fixture.detectChanges();
      const de = fixture.debugElement.query(By.css('jo-invoice-form'));
      expect(de).toBeTruthy();
    });

    it('should embed the quick invoice form if task is quick', async () => {
      component.task$.next('quick');
      fixture.detectChanges();
      const de = fixture.debugElement.query(By.css('jo-quick-invoice-form'));
      expect(de).toBeTruthy();
    });
  });

});
