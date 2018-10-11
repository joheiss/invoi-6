import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {Receiver} from '../models/receiver.model';
import * as fromStore from '../store/index';
import {select, Store} from '@ngrx/store';
import {BillingMethod, ContractSummary, PaymentMethod} from '../models/invoicing.model';
import {Contract, ContractData, ContractItem, ContractItemData} from '../models/contract.model';
import {Invoice} from '../models/invoice.model';
import {NumberRange} from '../models/number-range.model';
import * as fromAuth from '../../auth/store';
import {UserData} from '../../auth/models/user';
import {InvoicesBusinessService} from './invoices-business.service';
import * as fromRoot from '../../app/store';
import {filter, map} from 'rxjs/internal/operators';

@Injectable()
export class ContractsBusinessService {
  private static template: ContractData = {
    objectType: 'contracts',
    issuedAt: new Date(),
    currency: 'EUR',
    budget: 0,
    paymentMethod: PaymentMethod.BankTransfer,
    billingMethod: BillingMethod.Invoice,
    cashDiscountDays: 0,
    cashDiscountPercentage: 0,
    dueDays: 30,
  } as ContractData;

  private static itemTemplate = {
    pricePerUnit: 0
  } as ContractItemData;

  private nextId: string;
  private auth: UserData;

  private static getDefaultValues(): any {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const issuedAt = new Date(year, month, today.getDate());
    const defaultStartDate = new Date(year, month + 1, 1);
    const defaultEndDate = new Date(year, month + 4, 0);
    return {
      id: undefined,
      issuedAt: issuedAt,
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    };
  }

  constructor(private store: Store<fromStore.InvoicingState>,
              private invoicesBusinessService: InvoicesBusinessService) {
    this.store.pipe(select(fromAuth.selectAuth))
      .subscribe(auth => this.auth = auth);
    this.store.pipe(
      select(fromStore.selectNumberRangeEntities),
      filter(entities => !!entities['contracts']),
      map(entities => NumberRange.createFromData(entities['contracts']).nextId)
    )
      .subscribe(nextId => this.nextId = nextId);
  }

  addItem(contract: Contract) {
    contract.items.push(this.newItem(contract));
    this.change(contract);
  }

  change(contract: Contract) {
    this.store.dispatch(new fromStore.ChangeContractSuccess(contract.data));
  }

  copy(contract: Contract) {
    const data = Object.assign({},
      contract.data,
      {...ContractsBusinessService.getDefaultValues()},
      {organization: this.auth.organization}
    );
    this.store.dispatch(new fromStore.CopyContractSuccess(data));
  }

  create(contract: Contract) {
    contract.header.id = this.nextId;
    contract.header.organization = this.auth.organization;
    this.store.dispatch(new fromStore.CreateContract(contract.data));
  }

  createQuickInvoice(contract: Contract) {
    return this.invoicesBusinessService.newInvoiceFromContract(contract);
  }

  delete(contract: Contract) {
    this.store.dispatch(new fromRoot.OpenConfirmationDialog({
      do: new fromStore.DeleteContract(contract.data),
      title: `Soll der Vertrag ${contract.header.id} wirklich gelöscht werden?`
    }));
  }

  getCurrent(): Observable<Contract> {
    return this.store.pipe(select(fromStore.selectCurrentContractAsObj));
  }

  getInvoices(): Observable<Invoice[]> {
    return this.store.pipe(select(fromStore.selectAllInvoicesForContractAsObjArray));
  }

  getOpenInvoices(): Observable<Invoice[]> {
    return this.store.pipe(select(fromStore.selectOpenInvoicesForContractAsObjArray));
  }

  getPartner(): Observable<Receiver> {
    return this.store.pipe(select(fromStore.selectContractPartnerAsObj));
  }

  getReceivers(): Observable<Receiver[]> {
    return this.store.pipe(select(fromStore.selectActiveReceiversSortedAsObjArray));
  }

  getSummary(): Observable<ContractSummary[]> {
    return this.store.pipe(select(fromStore.selectContractSummariesAsSortedArray));
  }

  isDeletable(): Observable<boolean> {
    return this.store.pipe(select(fromStore.selectContractChangeable));
  }

  new() {
    const data = Object.assign({}, ContractsBusinessService.template);
    this.store.dispatch(new fromStore.NewContractSuccess(data));
  }

  newItem(contract: Contract): ContractItem {
    const itemData = Object.assign({}, {id: contract.getNextItemId()}, {...ContractsBusinessService.itemTemplate}) as ContractItemData;
    return ContractItem.createFromData(itemData);
  }

  removeItem(contract: Contract, itemId: number) {
    contract.items = contract.items.filter(item => item.data.id !== itemId);
    this.change(contract);
  }

  select(): Observable<ContractData> {
    return this.store.pipe(select(fromStore.selectSelectedContract));
  }

  update(contract: Contract) {
    this.store.dispatch(new fromStore.UpdateContract(contract.data));
  }

}
