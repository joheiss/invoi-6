import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {ReceiversBusinessService} from '../../business-services';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {cold} from 'jasmine-marbles';
import {mockAllContracts} from '../../../test/factories/mock-contracts.factory';
import {mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {mockAllInvoices} from '../../../test/factories/mock-invoices.factory';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs/index';
import {ReceiverDetailsComponent} from './receiver-details.component';
import {mockAllCountries} from '../../../test/factories/mock-settings.factory';
import {Store} from '@ngrx/store';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {ContractFactory, InvoiceFactory, Receiver, ReceiverFactory} from 'jovisco-domain';

describe('Receiver Details Component', () => {

  let component: ReceiverDetailsComponent;
  let fixture: ComponentFixture<ReceiverDetailsComponent>;
  let service: ReceiversBusinessService;
  let route: ActivatedRoute;
  let receiver: Receiver;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [ReceiverDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ReceiversBusinessService,
          useValue: {
            change: jest.fn(),
            copy: jest.fn(),
            create: jest.fn(),
            createQuickInvoice: jest.fn(),
            delete: jest.fn(),
            getRecentContracts: jest.fn(() => cold('-a|', { a: mockAllContracts().slice(0, 1).map(c => ContractFactory.fromData(c)) })),
            getActiveContracts: jest.fn(() => cold('-a|', { a: mockAllContracts().slice(0, 2).map(c => ContractFactory.fromData(c)) })),
            getCountries: jest.fn(() => cold('-a|', { a: mockAllCountries()})),
            getCurrent: jest.fn(() => cold('-a|', { a: ReceiverFactory.fromData(mockSingleReceiver()) })),
            getLastInvoices: jest.fn(() => cold('-a|', { a: mockAllInvoices().slice(0, 1).map(i => InvoiceFactory.fromData(i)) })),
            getOpenInvoices: jest.fn(() => cold('-a|', { a: mockAllInvoices().slice(0, 2).map(i => InvoiceFactory.fromData(i)) })),
            getReceiver: jest.fn(() => cold('-a|', { a: ReceiverFactory.fromData(mockSingleReceiver()) })),
            isDeletable: jest.fn(() => cold('-a|', { a: false })),
            isQualifiedForQuickInvoice: jest.fn(() => cold('-a|', { a: true })),
            isUserAllowedToEdit: jest.fn(() => true),
            new: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: cold('-a|', {a: {get: () => '1901'}})
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
    service = TestBed.get(ReceiversBusinessService);
    route = TestBed.get(ActivatedRoute);
    fixture = TestBed.createComponent(ReceiverDetailsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    component.receiver$ = of(ReceiverFactory.fromData((mockSingleReceiver())));
    fixture.detectChanges();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      receiver = ReceiverFactory.fromData(mockSingleReceiver());
    });

    it('should invoke createQuickInvoice service if quick invoice is requested', () => {
      const spy = jest.spyOn(service, 'createQuickInvoice');
      component.onQuickInvoice(receiver);
      expect(spy).toHaveBeenCalledWith(receiver);
    });

    it('should return the correct title', () => {
      expect(component['getTitle'](receiver)).toContain(receiver.header.id);
      expect(component['getTitle'](receiver)).toContain(receiver.header.name);
    });

    it('should initialize receiver, recent and active contracts as well as open and recent invoices', () => {
      component['initializeWithData']('edit');
      fixture.detectChanges();
      let expected: any = cold('-a|', { a: mockAllCountries() });
      expect(component.countries$).toBeObservable(expected);
      expected = cold('---a|', { a: ReceiverFactory.fromData(mockSingleReceiver()) });
      expect(component.receiver$).toBeObservable(expected);
      expected = cold('-----a|', { a: mockAllContracts().slice(0, 2).map(c => ContractFactory.fromData(c)) });
      expect(component.activeContractsForReceiver$).toBeObservable(expected);
      expected = cold('-------a|', { a: mockAllContracts().slice(0, 1).map(c => ContractFactory.fromData(c)) });
      expect(component.lastContractsForReceiver$).toBeObservable(expected);
      expected = cold('---------a|', { a: mockAllInvoices().slice(0, 2).map(i => InvoiceFactory.fromData(i)) });
      expect(component.openInvoicesForReceiver$).toBeObservable(expected);
      expected = cold('-----------a|', { a: mockAllInvoices().slice(0, 1).map(i => InvoiceFactory.fromData(i)) });
      expect(component.lastInvoicesForReceiver$).toBeObservable(expected);
      expected = cold('-------------a|', { a: false });
      expect(component.isDeletable$).toBeObservable(expected);
      expected = cold('---------------a|', { a: true });
      expect(component.isQualifiedForQuickInvoice$).toBeObservable(expected);
    });

  });

  describe('View', () => {

    it('should embed the receiver form', async () => {
      component.task$.next('edit');
      fixture.detectChanges();
      const de = fixture.debugElement.query(By.css('jo-receiver-form'));
      expect(de).toBeTruthy();
    });

  });

});
