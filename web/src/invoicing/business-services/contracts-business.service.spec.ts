import {Store} from '@ngrx/store';
import {TestBed} from '@angular/core/testing';
import {cold} from 'jasmine-marbles';
import {InvoicingState} from '../store/reducers';
import {ContractsBusinessService} from './contracts-business.service';
import {InvoicesBusinessService} from './invoices-business.service';
import {ChangeContractSuccess, CopyContractSuccess, CreateContract, NewContractSuccess, UpdateContract} from '../store/actions';
import {OpenConfirmationDialog} from '../../app/store/actions';
import * as fromStore from '../store';
import {mockNumberRangeEntity} from '../../test/factories/mock-number-ranges.factory';
import {filter, map, take} from 'rxjs/operators';
import {of} from 'rxjs/index';
import {mockAuth} from '../../test/factories/mock-auth.factory';
import {mockSingleContract} from '../../test/factories/mock-contracts.factory';
import {DateTime} from 'luxon';
import {
  BillingMethod,
  Contract,
  ContractFactory,
  ContractItem,
  ContractTermFactory,
  DateUtility,
  NumberRangeFactory,
  PaymentMethod
} from 'jovisco-domain';

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
            pipe: jest.fn(() => cold('-b|', {b: true}))
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
    service.auth = {...mockAuth()[0]};
    // @ts-ignore
    service.nextId = '4904';
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
    // expect(store.pipe).toHaveBeenCalled();
  });

  it('should return a meaningful contract header template', () => {
    const template = Contract.defaultValues();
    expect(template.objectType).toBe('contracts');
    expect(template.issuedAt).toEqual(DateTime.local().startOf('day').toJSDate());
    expect(template.currency).toEqual('EUR');
    expect(template.paymentMethod).toEqual(PaymentMethod.BankTransfer);
    expect(template.billingMethod).toEqual(BillingMethod.Invoice);
    expect(template.cashDiscountDays).toBe(0);
    expect(template.cashDiscountPercentage).toEqual(0);
    expect(template.dueDays).toBe(30);
  });

  it('should return a meaningful contract item template', () => {
    const template = ContractItem.defaultValues();
    expect(template.pricePerUnit).toEqual(0);
  });

  it('should return meaningful default values to be used in a new contract', () => {
    const values = Contract.defaultValues();
    const issuedAt = DateUtility.getCurrentDate();
    const term = ContractTermFactory.nextDefaultTerm(issuedAt);
    expect(values.id).toBeFalsy();
    expect(values.issuedAt).toEqual(issuedAt);
    expect(values.term).toEqual(term);
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
      filter(entities => !!entities['contracts']),
      map(entities => NumberRangeFactory.fromData(entities['contracts']).nextId),
      take(1)
    ).subscribe(nextId => {
        expect(nextId).toBe('4951');
        done();
      });
  });

  it('should invoke newItem and change if item addition is processed', async () => {
    const contract = mockSingleContract();
    const spyNew = jest.spyOn(service, 'newItem');
    const spyChange = jest.spyOn(service, 'change');
    service.addItem(ContractFactory.fromData(contract));
    await expect(spyNew).toHaveBeenCalled();
    return expect(spyChange).toHaveBeenCalled();
  });

  it('should dispatch ChangeContractSuccess event if change is processed', async () => {
    const contract = mockSingleContract();
    const event = new ChangeContractSuccess(contract);
    const spy = jest.spyOn(store, 'dispatch');
    service.change(ContractFactory.fromData(contract));
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CopyContractSuccess event if copy is processed', async () => {
    const contract = mockSingleContract();
    const newContract = Object.assign({},
      contract,
      {...Contract.defaultValues()},
      {organization: 'THQ'}
    );
    const event = new CopyContractSuccess(newContract);
    const spy = jest.spyOn(store, 'dispatch');
    service.copy(ContractFactory.fromData(contract));
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CreateContract action if create is processed', async () => {
    const contract = {...mockSingleContract(), id: service['nextId'], isDeletable: true };
    const action = new CreateContract(contract);
    const spy = jest.spyOn(store, 'dispatch');
    service.create(ContractFactory.fromData(contract));
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should invoke InvoiceBusinessService.newInvoiceFromContract if createQuickInvoice is processed', async () => {
    const contract = mockSingleContract();
    const spy = jest.spyOn(invoicesService, 'newInvoiceFromContract');
    service.createQuickInvoice(ContractFactory.fromData(contract));
    return expect(spy).toHaveBeenCalledWith(ContractFactory.fromData(contract));
  });

  it('should dispatch OpenConfirmationDialog action if delete is processed', async () => {
    const contract = mockSingleContract();
    const action = new OpenConfirmationDialog({
      do: new fromStore.DeleteContract(contract),
      title: `Soll der Vertrag ${contract.id} wirklich gelöscht werden?`
    });
    const spy = jest.spyOn(store, 'dispatch');
    service.delete(ContractFactory.fromData(contract));
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
    const newContract = Object.assign({}, Contract.defaultValues());
    const event = new NewContractSuccess(newContract);
    const spy = jest.spyOn(store, 'dispatch');
    service.new(ContractFactory.fromData(newContract));
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should invoke change if removeItem is processed', async () => {
    const contract = mockSingleContract();
    const updatedContract = Object.assign({}, contract);
    updatedContract.items = updatedContract.items.filter(item => item.id !== 4);
    const spy = jest.spyOn(service, 'change');
    service.removeItem(ContractFactory.fromData(contract), 4);
    return expect(spy).toHaveBeenCalledWith(ContractFactory.fromData(updatedContract));
  });

  // it('should invoke store selector if select is processed', async () => {
  //   const spy = jest.spyOn(store, 'pipe');
  //   service.select();
  //   return expect(spy).toHaveBeenCalled();
  // });

  it('should dispatch UpdateContract action if update is processed', async () => {
    const contract = mockSingleContract();
    const action = new UpdateContract(contract);
    const spy = jest.spyOn(store, 'dispatch');
    service.update(ContractFactory.fromData(contract));
    return expect(spy).toHaveBeenCalledWith(action);
  });

});
