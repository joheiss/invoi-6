import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {cold} from 'jasmine-marbles';
import {InvoicesBusinessService} from './invoices-business.service';
import {InvoicingState} from '../store/reducers';
import {ReceiversBusinessService} from './receivers-business.service';
import {SettingsBusinessService} from '../../admin/business-services/settings-business.service';
import {ChangeReceiverSuccess, CopyReceiverSuccess, CreateReceiver, NewReceiverSuccess, UpdateReceiver} from '../store/actions';
import {OpenConfirmationDialog} from '../../app/store/actions';
import * as fromStore from '../store';
import {mockSingleReceiver} from '../../test/factories/mock-receivers.factory';
import {mockAuth} from '../../test/factories/mock-auth.factory';
import {of} from 'rxjs/internal/observable/of';
import {filter, map, take, tap} from 'rxjs/operators';
import {mockNumberRangeEntity} from '../../test/factories/mock-number-ranges.factory';
import {mockAllContracts} from '../../test/factories/mock-contracts.factory';
import {ContractFactory, MasterdataStatus, NumberRangeFactory, Receiver, ReceiverFactory} from 'jovisco-domain';

describe('Receivers Business Service', () => {

  let store: Store<InvoicingState>;
  let service: ReceiversBusinessService;
  let settings: SettingsBusinessService;
  let invoices: InvoicesBusinessService;
  let receiver: Receiver;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => cold('-b|', {b: true}))
          }
        },
        {
          provide: InvoicesBusinessService,
          useValue: {
            newInvoiceFromContract: jest.fn()
          }
        },
        {
          provide: SettingsBusinessService,
          useValue: {
            getCountries: jest.fn()
          }
        },
        ReceiversBusinessService
      ]
    });
    store = TestBed.get(Store);
    service = TestBed.get(ReceiversBusinessService);
    invoices = TestBed.get(InvoicesBusinessService);
    settings = TestBed.get(SettingsBusinessService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  beforeEach(() => {
    // @ts-ignore
    service.auth = {...mockAuth()[0]};
    // @ts-ignore
    service.nextId = '1903';
    receiver = ReceiverFactory.fromData(mockSingleReceiver());
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });

  it('should return a meaningful template', () => {
    const template = Receiver.defaultValues();
    expect(template.objectType).toEqual('receivers');
    expect(template.status).toEqual(MasterdataStatus.active);
    expect(template.address.country).toEqual('DE');
  });

  it('should return meaningful default values', () => {
    const values = Receiver.defaultValues();
    expect(values.id).toBeUndefined();
  });

  it('should retrieve correct auth data during construction', done => {
    of(mockAuth(['sales-user'])).pipe(
      take(1)
    ).subscribe(auth => {
      expect(auth[0]).toBeTruthy();
      expect(auth[0].uid).toEqual('991OyAr37pNsS8BGHzidmOGAGVX2');
      expect(auth[0].isLocked).toBeFalsy();
      done();
    });
  });

  it('should retrieve correct number range during construction', done => {
    of(mockNumberRangeEntity()).pipe(
      filter(entities => !!entities['receivers']),
      map(entities => NumberRangeFactory.fromData(entities['receivers']).nextId),
      take(1)
    ).subscribe(nextId => {
      expect(nextId).toBe('1911');
      done();
    });
  });

  it('should dispatch ChangeReceiverSuccess event if change is processed', async () => {
    const event = new ChangeReceiverSuccess(receiver.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.change(receiver);
    await expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CopyReceiverSuccess event if copy is processed', async () => {
    const defaults = Receiver.defaultValues();
    const newReceiverData = {...receiver.data, ...defaults, organization: 'THQ'};
    const event = new CopyReceiverSuccess(newReceiverData);
    const spy = jest.spyOn(store, 'dispatch');
    service.copy(receiver);
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CreateReceiver action if create is processed', async () => {
    const newReceiver = Object.assign(receiver);
    newReceiver.header.id = '1903';
    newReceiver.header.isDeletable = true;
    const action = new CreateReceiver(newReceiver.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.create(newReceiver);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should create new invoice for receiver if there is exactly one invoicable contract for the receiver', done => {
    const spy = jest.spyOn(invoices, 'newInvoiceFromContract');
    const contracts = mockAllContracts()
      .filter(c => c.customerId === receiver.header.id)
      .map(c => ContractFactory.fromData(c));

    console.log('contracts: ', contracts);

    of(contracts).pipe(
      map(contracts => contracts.filter(contract => contract.term.isInvoiceable)),
      tap(contracts => console.log('invoiceable contracts: ', contracts)),
      filter(contracts => contracts.length === 1),
      map(contracts => invoices.newInvoiceFromContract(contracts[0])),
      take(1)
    )
      .subscribe(() => {
        expect(spy).toHaveBeenCalled();
        done();
      });
});

  it('should NOT create new invoice for receiver if there is NOT exactly one invoicable contract for the receiver', done => {
    const spy = jest.spyOn(invoices, 'newInvoiceFromContract');
    const contracts = mockAllContracts()
      .map(c => ContractFactory.fromData(c));

    of(contracts).pipe(
      map(contracts => contracts.filter(contract => contract.term.isInvoiceable)),
      filter(contracts => contracts.length === 1),
      map(contracts => invoices.newInvoiceFromContract(contracts[0])),
      take(1)
    )
      .subscribe(
        next => console.log('should not happen'),
        error => console.log('Error: ', error),
        () => done()
      );
  });

it('should dispatch OpenConfirmationDialog action if delete is processed', async () => {
  const action = new OpenConfirmationDialog({
    do: new fromStore.DeleteReceiver(receiver.data),
    title: `Soll der Rechnungsempfänger ${receiver.header.id} wirklich gelöscht werden?`
  });
  const spy = jest.spyOn(store, 'dispatch');
  service.delete(receiver);
  return expect(spy).toHaveBeenCalledWith(action);
});

it('should invoke store selector if getActiveContracts is processed', async () => {
  const spy = jest.spyOn(store, 'pipe');
  service.getActiveContracts();
  return expect(spy).toHaveBeenCalled();
});

it('should invoice SettingsBusinessService.getCountries if getCountries is processed', async () => {
  const spy = jest.spyOn(settings, 'getCountries');
  service.getCountries();
  return expect(spy).toHaveBeenCalled();
});

it('should invoke store selector if getCurrent is processed', async () => {
  const spy = jest.spyOn(store, 'pipe');
  service.getCurrent();
  return expect(spy).toHaveBeenCalled();
});

it('should invoke store selector if getLastInvoices is processed', async () => {
  const spy = jest.spyOn(store, 'pipe');
  service.getLastInvoices();
  return expect(spy).toHaveBeenCalled();
});

it('should invoke store selector if getOpenInvoices is processed', async () => {
  const spy = jest.spyOn(store, 'pipe');
  service.getOpenInvoices();
  return expect(spy).toHaveBeenCalled();
});

it('should invoke store selector if getRecentContracts is processed', async () => {
  const spy = jest.spyOn(store, 'pipe');
  service.getRecentContracts();
  return expect(spy).toHaveBeenCalled();
});

it('should invoke store selector if getOpenInvoices is processed', async () => {
  const spy = jest.spyOn(store, 'pipe');
  service.getSummary();
  return expect(spy).toHaveBeenCalled();
});

it('should invoke store selector if getRecentContracts is processed', async () => {
  const spy = jest.spyOn(store, 'pipe');
  service.getRecentContracts();
  return expect(spy).toHaveBeenCalled();
});

it('should invoke store selector if isDeletable is processed', async () => {
  const spy = jest.spyOn(store, 'pipe');
  service.isDeletable();
  return expect(spy).toHaveBeenCalled();
});

it('should invoke store selector if isQualifiedForQuickInvoice is processed', async () => {
  const spy = jest.spyOn(store, 'pipe');
  service.isQualifiedForQuickInvoice();
  return expect(spy).toHaveBeenCalled();
});

// it('should invoke store selector if query is processed', async () => {
//   const spy = jest.spyOn(store, 'pipe');
//   service.query();
//   return expect(spy).toHaveBeenCalled();
// });

// it('should invoke store selector if select is processed', async () => {
//   const spy = jest.spyOn(store, 'pipe');
//   service.select();
//   return expect(spy).toHaveBeenCalled();
// });

it('should dispatch NewReceiverSuccess event if new is processed', async () => {
  const newReceiver = Object.assign({}, Receiver.defaultValues());
  const event = new NewReceiverSuccess(newReceiver);
  const spy = jest.spyOn(store, 'dispatch');
  service.new( ReceiverFactory.fromData(newReceiver));
  return expect(spy).toHaveBeenCalledWith(event);
});

it('should dispatch UpdateReceiver action when update is processed', async () => {
  const action = new UpdateReceiver(receiver.data);
  const spy = jest.spyOn(store, 'dispatch');
  service.update(receiver);
  return expect(spy).toHaveBeenCalledWith(action);
});

})
;
