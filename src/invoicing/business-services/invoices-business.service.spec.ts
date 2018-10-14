import {Store} from '@ngrx/store';
import {generateContract, generateInvoice, generateInvoiceData, generateNewInvoice, generateUserProfile} from '../../test/test-generators';
import {TestBed} from '@angular/core/testing';
import {cold} from 'jasmine-marbles';
import {InvoicingState} from '../store/reducers';
import {InvoicesBusinessService} from './invoices-business.service';
import {
  ChangeInvoiceSuccess,
  CopyInvoiceSuccess,
  CreateInvoice,
  CreateInvoicePdf,
  NewInvoiceSuccess,
  NewQuickInvoiceSuccess,
  SendInvoiceEmail,
  UpdateInvoice
} from '../store/actions';
import {OpenConfirmationDialog} from '../../app/store/actions';
import * as fromStore from '../store';
import {Invoice} from '../models/invoice.model';
import {Contract} from '../models/contract.model';

let store: Store<InvoicingState>;
let service: InvoicesBusinessService;
let invoice: Invoice;

describe('Invoices Business Service', () => {

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
        InvoicesBusinessService
      ]
    });
    store = TestBed.get(Store);
    service = TestBed.get(InvoicesBusinessService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  beforeEach(() => {
    // @ts-ignore
    service.auth = {...generateUserProfile(), organization: 'THQ'};
    // @ts-ignore
    service.nextIds = ['5905', '6905'];
    invoice = generateInvoice();
    service['currentData'] = invoice.data;
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });

  it('should invoke newItem and change if item addition is processed', async () => {
    const spyNew = jest.spyOn(service, 'newItem');
    const spyChange = jest.spyOn(service, 'change');
    service.addItem(invoice);
    await expect(spyNew).toHaveBeenCalled();
    return expect(spyChange).toHaveBeenCalled();
  });

  it('should invoke processChanges and dispatch ChangeInvoiceSuccess event if change is processed', async () => {
    const event = new ChangeInvoiceSuccess(invoice.data);
    const spy = jest.spyOn(store, 'dispatch');
    const spyProcessChanges = jest.spyOn<any, any>(service, 'processChanges');
    service.change(invoice);
    await expect(spyProcessChanges).toHaveBeenCalledWith(invoice);
    // await expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CopyInvoiceSuccess event if copy is processed', async () => {
    const defaults = InvoicesBusinessService['getDefaultValues']();
    const newInvoiceData = { ...invoice.data, ...defaults, organization: 'THQ' };
    const event = new CopyInvoiceSuccess(newInvoiceData);
    const spy = jest.spyOn(store, 'dispatch');
    service.copy(invoice);
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CreateInvoice action if create is processed', async () => {
    const newInvoice = invoice;
    newInvoice.header.id = '5905';
    const action = new CreateInvoice(newInvoice.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.create(newInvoice);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch CreateInvoicePdf action if PDF creation is processed', async () => {
    const action = new CreateInvoicePdf(invoice.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.createPdf(invoice);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch OpenConfirmationDialog action if delete is processed', async () => {
    const action = new OpenConfirmationDialog({
      do: new fromStore.DeleteInvoice(invoice.data),
      title: `Soll die Rechnung ${invoice.header.id} wirklich gelöscht werden?`
    });
    const spy = jest.spyOn(store, 'dispatch');
    service.delete(invoice);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should invoke store selector if getContract is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getContract();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if getContracts is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getContracts();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if getCurrent is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getCurrent();
    return expect(spy).toHaveBeenCalled();
  });

  it('should return the next id for an invoice', async () => {
    return expect(service.getNextId(invoice)).toEqual('5905');
  });

  it('should invoke store selector if getReceiver is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getReceiver();
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

  it('should invoke store selector if isChangeable is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.isChangeable();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if isDeletable is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.isDeletable();
    return expect(spy).toHaveBeenCalled();
  });

  it('should dispatch NewInvoiceSuccess event if new is processed', async () => {
    const newInvoice = Object.assign({}, InvoicesBusinessService['template']);
    const event = new NewInvoiceSuccess(newInvoice);
    const spy = jest.spyOn(store, 'dispatch');
    service.new();
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should prepare a new invoice for a given contract and dispatch NewQuickInvoiceSuccess event', async () => {
    const contract = generateContract();
    const newInvoice = generateNewInvoice();
    service['getVatPercentage'] = jest.fn(() => cold('-b|', {b: 19.0}));
    const event = new NewQuickInvoiceSuccess(newInvoice.data);
    const spy = jest.spyOn(store, 'dispatch');
    await service.newInvoiceFromContract(contract);
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should invoke change if removeItem is processed', async () => {
    const updatedInvoice = Object.assign({}, invoice);
    updatedInvoice.items = updatedInvoice.items.filter(item => item.data.id !== 4);
    const spy = jest.spyOn(service, 'change');
    service.removeItem(invoice, 4);
    return expect(spy).toHaveBeenCalledWith(updatedInvoice);
  });

  it('should invoke store selector if select is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.select();
    return expect(spy).toHaveBeenCalled();
  });

  it('should dispatch SendInvoiceEmail action when sendEmail is processed', async () => {
    const action = new SendInvoiceEmail(invoice.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.sendEmail(invoice);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch UpdateInvoice action when update is processed', async () => {
    const action = new UpdateInvoice(invoice.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.update(invoice);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should detect change of receiver on an invoice and handle it', async () => {
    service['getVatPercentage'] = jest.fn(() => cold('-a|', { a: 18.0 }));
    const currentInvoice = generateInvoice();
    service['currentData'] = currentInvoice.data;
    const changedInvoice = generateInvoice();
    changedInvoice.header.receiverId = '1902';
    const expectedInvoice = generateInvoice();
    expectedInvoice.header.receiverId = '1902';
    expectedInvoice.header.vatPercentage = 18.0;
    const expected = cold('-(a|)', { a: expectedInvoice });
    expect(service['processChanges'](changedInvoice)).toBeObservable(expected);
    // const spy = jest.spyOn(store, 'dispatch');
    // service.change(changedInvoice);
    // const event = new ChangeInvoiceSuccess(expectedInvoice.data);
    // expect(spy).toHaveBeenCalledWith(event);
  });

  it('should detect change of contract on an invoice and handle it', async () => {
    const currentContract = generateContract();
    const otherContract = generateContract();
    otherContract.header.id = '4902';
    otherContract.header.invoiceText = 'anderer Text';
    const contracts: Contract[] = [currentContract, otherContract];
    service.getContracts = jest.fn(() => cold('-a|', { a: contracts }));
    const currentInvoice = generateInvoice();
    service['currentData'] = currentInvoice.data;
    const changedInvoice = generateInvoice();
    changedInvoice.header.contractId = '4902';
    changedInvoice.header.internalText = 'Änderung!!!';
    changedInvoice.items[0].pricePerUnit = 555.55;
    changedInvoice.items = changedInvoice.items.filter(item => item.id < 4);
    const expectedInvoice = generateInvoice();
    expectedInvoice.header.contractId = '4902';
    expectedInvoice.header.internalText = 'Änderung!!!';
    expectedInvoice.items[0].pricePerUnit = 555.55;
    expectedInvoice.items = changedInvoice.items.filter(item => item.id < 4);
    expectedInvoice.header.invoiceText = otherContract.header.invoiceText;
    const expected = cold('-(a|)', { a: expectedInvoice });
    expect(service['processChanges'](changedInvoice)).toBeObservable(expected);
  });

  it('should detect change of contract id on an invoice item and handle it', async () => {
    const currentContract = generateContract();
    const otherContract = generateContract();
    otherContract.header.id = '4902';
    otherContract.header.invoiceText = 'anderer Text';
    const contracts: Contract[] = [currentContract, otherContract];
    service.getContracts = jest.fn(() => cold('-a|', { a: contracts }));
    const currentInvoice = generateInvoice();
    service['currentData'] = currentInvoice.data;
    const changedInvoice = generateInvoice();
    changedInvoice.items[1].contractItemId = 1;
    const expectedInvoiceData = generateInvoiceData();
    expectedInvoiceData.items[1].contractItemId = 1;
    expectedInvoiceData.items[1].description = currentContract.data.items[0].description;
    expectedInvoiceData.items[1].pricePerUnit = currentContract.data.items[0].pricePerUnit;
    expectedInvoiceData.items[1].quantityUnit = currentContract.data.items[0].priceUnit;
    expectedInvoiceData.items[1].cashDiscountAllowed = currentContract.data.items[0].cashDiscountAllowed;
    const expectedInvoice = Invoice.createFromData(expectedInvoiceData);
    const expected = cold('-(a|)', { a: expectedInvoice });
    expect(service['processChanges'](changedInvoice)).toBeObservable(expected);
    // const spy = jest.spyOn(store, 'dispatch');
    // service.change(changedInvoice);
    // const event = new ChangeInvoiceSuccess(expectedInvoice.data);
    // expect(spy).toHaveBeenCalledWith(event);
  });

  it('should determine changes and flatten them to array of changes', () => {
    const currentInvoice = generateInvoice();
    service['currentData'] = currentInvoice.data;
    const changedInvoice = generateInvoice();
    changedInvoice.header.receiverId = '1902';
    changedInvoice.header.contractId = '4902';
    changedInvoice.header.invoiceText = 'Test Change invoiceText';
    changedInvoice.items[1].contractItemId = 1;
    changedInvoice.items = changedInvoice.items.filter(item => item.id !== 3);
    changedInvoice.items[2].pricePerUnit = 123.45;
    const expected = [
      { mode: 'changed', object: 'header', field: 'receiverId', value: '1902' },
      { mode: 'changed', object: 'header', field: 'contractId', value: '4902' },
      { mode: 'changed', object: 'header', field: 'invoiceText', value: 'Test Change invoiceText' },
      { mode: 'changed', object: 'item', id: 2, field: 'contractItemId', value: 1 },
      { mode: 'deleted', object: 'item', id: 3 },
      { mode: 'changed', object: 'item', id: 4, field: 'pricePerUnit', value: 123.45 }
      ];
    expect(service['determineChanges'](changedInvoice.data, currentInvoice.data)).toEqual(expected);
  });

});

