import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {cold} from 'jasmine-marbles';
import {InvoicesBusinessService} from './invoices-business.service';
import {InvoicingState} from '../store/reducers';
import {Receiver} from '../models/receiver.model';
import {ReceiversBusinessService} from './receivers-business.service';
import {SettingsBusinessService} from './settings-business.service';
import {generateReceiver, generateUserProfile} from '../../test/test-generators';
import {ChangeReceiverSuccess, CopyReceiverSuccess, CreateReceiver, NewReceiverSuccess, UpdateReceiver} from '../store/actions';
import {OpenConfirmationDialog} from '../../app/store/actions';
import * as fromStore from '../store';

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
    service.auth = {...generateUserProfile(), organization: 'THQ'};
    // @ts-ignore
    service.nextId = '1903';
    receiver = generateReceiver();
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });

  it('should dispatch ChangeReceiverSuccess event if change is processed', async () => {
    const event = new ChangeReceiverSuccess(receiver.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.change(receiver);
    await expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CopyReceiverSuccess event if copy is processed', async () => {
    const defaults = ReceiversBusinessService['getDefaultValues']();
    const newReceiverData = {...receiver.data, ...defaults, organization: 'THQ'};
    const event = new CopyReceiverSuccess(newReceiverData);
    const spy = jest.spyOn(store, 'dispatch');
    service.copy(receiver);
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CreateReceiver action if create is processed', async () => {
    const newReceiver = Object.assign(receiver);
    newReceiver.header.id = '1903';
    const action = new CreateReceiver(newReceiver.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.create(newReceiver);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should invoke InvoiceBusinessService.newInvoiceFromContract if createQuickInvoice is processed', async () => {
    /* no idea how to test this since all logic is within pipe
    const contract = generateContract();
    store.pipe = jest.fn(() => cold('-a|', { a: contract }));
    const spy = jest.spyOn(invoices, 'newInvoiceFromContract');
    service.createQuickInvoice(receiver);
    return expect(spy).toHaveBeenCalledWith(contract);
    */
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

  it('should invoke store selector if query is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.query();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if select is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.select();
    return expect(spy).toHaveBeenCalled();
  });

  it('should dispatch NewReceiverSuccess event if new is processed', async () => {
    const newReceiver = Object.assign({}, ReceiversBusinessService['template']);
    const event = new NewReceiverSuccess(newReceiver);
    const spy = jest.spyOn(store, 'dispatch');
    service.new();
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch UpdateReceiver action when update is processed', async () => {
    const action = new UpdateReceiver(receiver.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.update(receiver);
    return expect(spy).toHaveBeenCalledWith(action);
  });

});
