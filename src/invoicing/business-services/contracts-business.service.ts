import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {Receiver} from '../models/receiver.model';
import * as fromStore from '../store/index';
import {Action, select, Store} from '@ngrx/store';
import {BillingMethod, ContractSummary, PaymentMethod} from '../models/invoicing.model';
import {Contract, ContractData, ContractItem, ContractItemData} from '../models/contract.model';
import {Invoice} from '../models/invoice.model';
import {NumberRange} from '../models/number-range.model';
import {InvoicesBusinessService} from './invoices-business.service';
import {filter, map} from 'rxjs/operators';
import {DateUtilities} from '../../shared/utilities/date-utilities';
import {AbstractTransactionBusinessService} from './abstract-transaction-business-service';

@Injectable()
export class ContractsBusinessService extends AbstractTransactionBusinessService<Contract, ContractSummary> {
  private static template: ContractData = {
    objectType: 'contracts',
    issuedAt: DateUtilities.getDateOnly(new Date()),
    currency: 'EUR',
    budget: 0,
    paymentMethod: PaymentMethod.BankTransfer,
    billingMethod: BillingMethod.Invoice,
    cashDiscountDays: 0,
    cashDiscountPercentage: 0,
    dueDays: 30,
    invoiceText: null,
    internalText: null
  } as ContractData;

  private static itemTemplate = {
    pricePerUnit: 0
  } as ContractItemData;

  private nextId: string;

  private static getDefaultValues(): any {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    return {
      id: undefined,
      issuedAt: DateUtilities.getDateOnly(today),
      startDate: DateUtilities.getDateOnly(new Date(year, month + 1, 1)),
      endDate: DateUtilities.getEndDate(new Date(year, month + 4, 0))
    };
  }

  constructor(protected store: Store<fromStore.InvoicingState>,
              private invoicesBusinessService: InvoicesBusinessService) {
    super(store);
    this.setNextIdFromNumberRange();
  }

  createQuickInvoice(contract: Contract) {
    return this.invoicesBusinessService.newInvoiceFromContract(contract);
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

  protected buildChangeSuccessEvent(data: any): Action {
    return new fromStore.ChangeContractSuccess(data);
  }

  protected buildCopySuccessEvent(data: any): Action {
    return new fromStore.CopyContractSuccess(data);
  }

  protected buildCreateCommand(data: any): Action {
    return new fromStore.CreateContract(data);
  }

  protected buildDeleteCommand(data: any): Action {
    return new fromStore.DeleteContract(data);
  }

  protected buildItem(data: any): ContractItem {
    return ContractItem.createFromData(data);
  }

  protected buildNewEvent(data: any): Action {
    return new fromStore.NewContractSuccess(data);
  }

  protected buildUpdateCommand(data: any): Action {
    return new fromStore.UpdateContract(data);
  }

  protected getConfirmationQuestion(id: string): string {
    return `Soll der Vertrag ${id} wirklich gelöscht werden?`;
  }

  protected getCurrentSelector(): Function {
    return fromStore.selectCurrentContractAsObj;
  }

  protected getDefaultValues(): any {
    return ContractsBusinessService.getDefaultValues();
  }

  protected getIsChangeableSelector(): Function {
    return fromStore.selectContractChangeable;
  }

  protected getIsDeletableSelector(): Function {
    return fromStore.selectContractChangeable;
  }

  protected getItemTemplate(): any {
    return ContractsBusinessService.itemTemplate;
  }

  protected getNextId(object: Contract): string {
    return this.nextId;
  }

  protected getSummarySelector(): Function {
    return fromStore.selectContractSummariesAsSortedArray;
  }

  protected getTemplate(): any {
    return ContractsBusinessService.template;
  }

  private setNextIdFromNumberRange(): void {
    this.store.pipe(
      select(fromStore.selectNumberRangeEntities),
      filter(entities => !!entities['contracts']),
      map(entities => NumberRange.createFromData(entities['contracts']).nextId),
    ).subscribe(nextId => this.nextId = nextId);
  }
}
