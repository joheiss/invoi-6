import {Store} from '@ngrx/store';
import {TestBed} from '@angular/core/testing';
import {cold} from 'jasmine-marbles';
import {InvoicingState} from '../store/reducers';
import {InvoicesBusinessService} from './invoices-business.service';
import {
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
import {Invoice, InvoiceData, InvoiceItem, InvoiceItemData, InvoiceStatus} from '../models/invoice.model';
import {Contract} from '../models/contract.model';
import {BillingMethod, PaymentMethod} from '../models/invoicing.model';
import {DateUtilities} from '../../shared/utilities/date-utilities';
import {of} from 'rxjs/internal/observable/of';
import {mockAuth} from '../../test/factories/mock-auth.factory';
import {filter, map, take} from 'rxjs/operators';
import {mockNumberRangeEntity} from '../../test/factories/mock-number-ranges.factory';
import {NumberRange} from '../models/number-range.model';
import {mockSingleInvoice} from '../../test/factories/mock-invoices.factory';
import {mockAllContracts, mockSingleContract} from '../../test/factories/mock-contracts.factory';

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
    service.auth = {...mockAuth()[0]};
    // @ts-ignore
    service.nextIds = ['5905', '6905'];
    invoice = Invoice.createFromData(mockSingleInvoice());
    service['currentData'] = invoice.data;
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });

  it('should return a meaningful header template', () => {
    const template = InvoicesBusinessService['template'];
    expect(template.objectType).toEqual('invoices');
    expect(template.billingMethod).toEqual(BillingMethod.Invoice);
    expect(template.issuedAt).toEqual(DateUtilities.getDateOnly());
    expect(template.status).toEqual(InvoiceStatus.created);
    expect(template.currency).toEqual('EUR');
    expect(template.vatPercentage).toEqual(19.0);
    expect(template.paymentTerms).toEqual('30 Tage: netto');
    expect(template.paymentMethod).toEqual(PaymentMethod.BankTransfer);
    expect(template.cashDiscountDays).toBe(0);
    expect(template.cashDiscountPercentage).toEqual(0);
    expect(template.dueInDays).toBe(30);
  });

  it('should return a meaningful item template', () => {
    const template = InvoicesBusinessService['itemTemplate'];
    expect(template.contractItemId).toBe(0);
    expect(template.quantity).toBe(0);
    expect(template.pricePerUnit).toBe(0);
  });

  it('should return meaningful default values', () => {
    const defaultValues = InvoicesBusinessService['getDefaultValues']();
    expect(defaultValues.id).toBeFalsy();
    expect(defaultValues.issuedAt).toEqual(DateUtilities.getDateOnly());
    expect(defaultValues.status).toEqual(InvoiceStatus.created);
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

  it('should retrieve correct number ranges during construction', done => {
    of(mockNumberRangeEntity()).pipe(
      take(1),
      filter(entities => !!entities['invoices'] && !!entities['credit-requests']),
      map(entities => {
        service['nextIds'] = [];
        service['nextIds'].push(NumberRange.createFromData(entities['invoices']).nextId);
        service['nextIds'].push(NumberRange.createFromData(entities['credit-requests']).nextId);
        return service['nextIds'];
      })
    ).subscribe(nextIds => {
      expect(nextIds[0]).toBe('5951');
      expect(nextIds[1]).toBe('6951');
      done();
    });
  });

  it('should invoke newItem and change if item addition is processed', async () => {
    const spyNew = jest.spyOn(service, 'newItem');
    const spyChange = jest.spyOn(service, 'change');
    service.addItem(invoice);
    await expect(spyNew).toHaveBeenCalledWith(invoice);
    invoice.items.push(service.newItem(invoice));
    return expect(spyChange).toHaveBeenCalledWith(invoice);
  });

  it('should invoke processChanges if change is processed', () => {
    const spyProcessChanges = jest.spyOn<any, any>(service, 'processChanges');
    invoice.header.invoiceText = 'Änderung';
    service.change(invoice);
    expect(spyProcessChanges).toHaveBeenCalledWith(invoice);
  });

  it('should dispatch CopyInvoiceSuccess event if copy is processed', async () => {
    const defaults = InvoicesBusinessService['getDefaultValues']();
    const newInvoiceData = {...invoice.data, ...defaults, organization: 'THQ'};
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

  it('should return the next id for an invoice', () => {
    expect(service.getNextId(invoice)).toEqual('5905');
    invoice.header.billingMethod = BillingMethod.CreditNote;
    expect(service.getNextId(invoice)).toEqual('6905');
  });

  it('should invoke store selector if getReceiver is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.getReceiver();
    return expect(spy).toHaveBeenCalled();
  });

  it('should invoke store selector if getReceivers is processed', async () => {
    store.pipe = jest.fn();
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

  it('should prepare a new invoice for a given contract and dispatch NewQuickInvoiceSuccess event', () => {
    const contract = mockSingleContract();
    const newInvoice = {
      ...InvoicesBusinessService['template'],
      receiverId: contract.customerId,
      contractId: contract.id,
      billingMethod: contract.billingMethod,
      currency: contract.currency,
      cashDiscountDays: contract.cashDiscountDays,
      cashDiscountPercentage: contract.cashDiscountPercentage,
      dueInDays: contract.dueDays,
      paymentTerms: contract.paymentTerms,
      paymentMethod: contract.paymentMethod,
      invoiceText: contract.invoiceText,
      items: [
        {
          id: 1,
          contractItemId: contract.items[0].id,
          description: contract.items[0].description,
          quantityUnit: contract.items[0].priceUnit,
          pricePerUnit: contract.items[0].pricePerUnit,
          cashDiscountAllowed: contract.items[0].cashDiscountAllowed
        }
      ]
    };
    const invoice = Invoice.createFromData(newInvoice);
    // service['getVatPercentage'] = jest.fn(() => cold('-b|', {b: 19.0}));
    service['getVatPercentage'] = jest.fn(() => of(19.0));
    const event = new NewQuickInvoiceSuccess(invoice.data);
    const spy = jest.spyOn(store, 'dispatch');
    service.newInvoiceFromContract(Contract.createFromData(contract));
    expect(spy).toHaveBeenCalledWith(event);
  });

  it('should return a new item (template)', () => {
    const itemData = {
      ...InvoicesBusinessService['itemTemplate'],
      id: invoice.getNextItemId()
    } as InvoiceItemData;
    const item = InvoiceItem.createFromData(itemData);
    expect(service.newItem(invoice)).toEqual(item);
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
    service['getVatPercentage'] = jest.fn(() => cold('-a|', {a: 18.0}));
    const currentInvoice = Invoice.createFromData(mockSingleInvoice());
    service['currentData'] = currentInvoice.data;
    const changedInvoice = Invoice.createFromData(mockSingleInvoice());
    changedInvoice.header.receiverId = '1902';
    const expectedInvoice = Invoice.createFromData(mockSingleInvoice());
    expectedInvoice.header.receiverId = '1902';
    expectedInvoice.header.vatPercentage = 18.0;
    const expected = cold('-(a|)', {a: expectedInvoice});
    expect(service['processChanges'](changedInvoice)).toBeObservable(expected);
    // const spy = jest.spyOn(store, 'dispatch');
    // service.change(changedInvoice);
    // const event = new ChangeInvoiceSuccess(expectedInvoice.data);
    // expect(spy).toHaveBeenCalledWith(event);
  });

  it('should detect change of contract on an invoice and handle it', async () => {
    const currentContract = Contract.createFromData(mockSingleContract());
    const otherContract = Contract.createFromData(mockSingleContract());
    otherContract.header.id = '4902';
    otherContract.header.invoiceText = 'anderer Text';
    const contracts: Contract[] = [currentContract, otherContract];
    service.getContracts = jest.fn(() => cold('-a|', {a: contracts}));
    const currentInvoice = Invoice.createFromData(mockSingleInvoice());
    service['currentData'] = currentInvoice.data;
    const changedInvoice = Invoice.createFromData(mockSingleInvoice());
    changedInvoice.header.contractId = '4902';
    changedInvoice.header.internalText = 'Änderung!!!';
    changedInvoice.items[0].pricePerUnit = 555.55;
    changedInvoice.items = changedInvoice.items.filter(item => item.id < 4);
    const expectedInvoice = Invoice.createFromData(mockSingleInvoice());
    expectedInvoice.header.contractId = '4902';
    expectedInvoice.header.internalText = 'Änderung!!!';
    expectedInvoice.items[0].pricePerUnit = 555.55;
    expectedInvoice.items = changedInvoice.items.filter(item => item.id < 4);
    expectedInvoice.header.invoiceText = otherContract.header.invoiceText;
    const expected = cold('-(a|)', {a: expectedInvoice});
    expect(service['processChanges'](changedInvoice)).toBeObservable(expected);
  });

  it('should detect change of contract id on an invoice item and handle it', async () => {
    const currentContract = Contract.createFromData(mockSingleContract());
    // console.log(mockAllContracts());
    // const otherContract = Contract.createFromData(
    //  mockAllContracts().find(c => c.id === '4908')
    // );
    // otherContract.header.invoiceText = 'anderer Text';
    // const contracts: Contract[] = [currentContract];
    service.getContracts = jest.fn(() => cold('-a|', {a: mockAllContracts().map(c => Contract.createFromData(c))}));
    const currentInvoice = Invoice.createFromData(mockSingleInvoiceWith4Items());
    service['currentData'] = currentInvoice.data;
    const changedInvoice = Invoice.createFromData(mockSingleInvoiceWith4Items());
    changedInvoice.items[1].contractItemId = 1;
    const expectedInvoiceData = mockSingleInvoiceWith4Items();
    expectedInvoiceData.items[1].contractItemId = 1;
    expectedInvoiceData.items[1].description = currentContract.data.items[0].description;
    expectedInvoiceData.items[1].pricePerUnit = currentContract.data.items[0].pricePerUnit;
    expectedInvoiceData.items[1].quantityUnit = currentContract.data.items[0].priceUnit;
    expectedInvoiceData.items[1].cashDiscountAllowed = currentContract.data.items[0].cashDiscountAllowed;
    const expectedInvoice = Invoice.createFromData(expectedInvoiceData);
    const expected = cold('-(a|)', {a: expectedInvoice});
    expect(service['processChanges'](changedInvoice)).toBeObservable(expected);
    // const spy = jest.spyOn(store, 'dispatch');
    // service.change(changedInvoice);
    // const event = new ChangeInvoiceSuccess(expectedInvoice.data);
    // expect(spy).toHaveBeenCalledWith(event);
  });

  it('should determine changes and flatten them to array of changes', () => {
    const currentInvoice = Invoice.createFromData(mockSingleInvoiceWith4Items());
    service['currentData'] = currentInvoice.data;
    const changedInvoice = Invoice.createFromData(mockSingleInvoiceWith4Items());
    changedInvoice.header.receiverId = '1902';
    changedInvoice.header.contractId = '4910';
    changedInvoice.header.invoiceText = 'Test Change invoiceText';
    changedInvoice.items[1].contractItemId = 1;
    changedInvoice.items = changedInvoice.items.filter(item => item.id !== 3);
    changedInvoice.items[2].pricePerUnit = 123.45;
    const expected = [
      {mode: 'changed', object: 'header', field: 'receiverId', value: '1902'},
      {mode: 'changed', object: 'header', field: 'contractId', value: '4910'},
      {mode: 'changed', object: 'header', field: 'invoiceText', value: 'Test Change invoiceText'},
      {mode: 'changed', object: 'item', id: 2, field: 'contractItemId', value: 1},
      {mode: 'deleted', object: 'item', id: 3},
      {mode: 'changed', object: 'item', id: 4, field: 'pricePerUnit', value: 123.45}
    ];

    expect(service['determineChanges'](changedInvoice.data, currentInvoice.data)).toEqual(expected);
  });

})
;

const mockSingleInvoiceWith4Items = (): InvoiceData => {
  const invoice = mockSingleInvoice();
  const additionalItems = [
    {
      id: 2, contractItemId: 2, description: 'Reisezeit im Projekt T/E/S/T', pricePerUnit: 1.00,
      quantity: 1.0, quantityUnit: 'Std.', cashDiscountAllowed: true, vatPercentage: 19.0
    },
    {
      id: 3, contractItemId: 3, description: 'km-Pauschale', pricePerUnit: 1.00,
      quantity: 1.0, quantityUnit: 'km', cashDiscountAllowed: false, vatPercentage: 19.0
    },
    {
      id: 4, contractItemId: 4, description: 'Übernachtungspauschale', pricePerUnit: 1.00,
      quantity: 1.0, quantityUnit: 'Übernachtungen', cashDiscountAllowed: false, vatPercentage: 19.0
    }
  ];
  invoice.items.push(...additionalItems);
  console.log(invoice.items);
  return invoice;
};

