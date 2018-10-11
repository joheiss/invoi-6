import {select, Store} from '@ngrx/store';
import {generateAuth, generateContract, generateNewContract, generateUserProfile} from '../../test/test-generators';
import {TestBed} from '@angular/core/testing';
import {cold} from 'jasmine-marbles';
import {InvoicingState} from '../store/reducers';
import {ContractsBusinessService} from './contracts-business.service';
import {InvoicesBusinessService} from './invoices-business.service';
import {ChangeContractSuccess, CopyContractSuccess, CreateContract, NewContractSuccess, UpdateContract} from '../store/actions';
import {OpenConfirmationDialog} from '../../app/store/actions';
import * as fromStore from '../store';

let store: Store<InvoicingState>;
let service: ContractsBusinessService;
let invoicesService: InvoicesBusinessService;

describe('Contracts Business Service', () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => cold('-b|', { b: true }))
          }
        },
        {
          provide: InvoicesBusinessService,
          useValue: {
            newInvoiceFromContract: jest.fn(),
          }
        },
        ContractsBusinessService
      ]
    });
    store = TestBed.get(Store);
    service = TestBed.get(ContractsBusinessService);
    invoicesService = TestBed.get(InvoicesBusinessService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  beforeEach(() => {
    // @ts-ignore
    service.auth = { ...generateUserProfile(), organization: 'THQ' };
    // @ts-ignore
    service.nextId = '4904';
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
    // expect(store.pipe).toHaveBeenCalled();
  });

  it('should invoke newItem and change if item addition is processed', async () => {
    const contract = generateContract();
    const spyNew = jest.spyOn(service, 'newItem');
    const spyChange = jest.spyOn(service, 'change');
    service.addItem(contract);
    await expect(spyNew).toHaveBeenCalled();
    return expect(spyChange).toHaveBeenCalled();
  });

  it('should dispatch ChangeContractSuccess event if change is processed', async () => {
    const contract = generateContract();
    const event = new ChangeContractSuccess(contract.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.change(contract);
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CopyContractSuccess event if copy is processed', async () => {
    const contract = generateContract();
    // @ts-ignore
    const defaults = ContractsBusinessService.getDefaultValues();
    const newContractData = Object.assign({}, contract.data, {...defaults}, {organization: 'THQ' });
    const event = new CopyContractSuccess(newContractData);
    const spy = jest.spyOn(store, 'dispatch');

    service.copy(contract);
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CreateContract action if create is processed', async () => {
    const contract = generateNewContract();
    const action = new CreateContract(contract.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.create(contract);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should invoke InvoiceBusinessService.newInvoiceFromContract if createQuickInvoice is processed', async () => {
    const contract = generateContract();
    const spy = jest.spyOn(invoicesService, 'newInvoiceFromContract');
    service.createQuickInvoice(contract);
    return expect(spy).toHaveBeenCalledWith(contract);
  });

  it('should dispatch OpenConfirmationDialog action if delete is processed', async () => {
    const contract = generateContract();
    const action = new OpenConfirmationDialog({
      do: new fromStore.DeleteContract(contract.data),
      title: `Soll der Vertrag ${contract.header.id} wirklich gelöscht werden?`
    });
    const spy = jest.spyOn(store, 'dispatch');
    service.delete(contract);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should invoke store selector if getCurrent is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getCurrent();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if getInvoices is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getInvoices();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if getOpenInvoices is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getOpenInvoices();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if getPartner is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getPartner();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if getReceivers is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getReceivers();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if getSummary is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getSummary();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if isDeletable is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.isDeletable();
    return expect(spy).toHaveBeenCalled();
  });

  it('should dispatch NewContractSuccess event if new is processed', async () => {
    // @ts-ignore
    const newContract = Object.assign({}, ContractsBusinessService.template);
    const event = new NewContractSuccess(newContract);
    const spy = jest.spyOn(store, 'dispatch');
    service.new();
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should invoke change if removeItem is processed', async () => {
    const contract = generateContract();
    const updatedContract = Object.assign({}, contract);
    updatedContract.items = updatedContract.items.filter(item => item.data.id !== 4);
    const spy = jest.spyOn(service, 'change');
    service.removeItem(contract, 4);
    return expect(spy).toHaveBeenCalledWith(updatedContract);
  });

  it('should invoke store selector if select is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.select();
    return expect(spy).toHaveBeenCalled();
  });

  it('should dispatch UpdateContract action if update is processed', async () => {
    const contract = generateNewContract();
    const action = new UpdateContract(contract.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.update(contract);
    return expect(spy).toHaveBeenCalledWith(action);
  });

});
