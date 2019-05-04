import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as fromStore from '../store';
import {Action, select, Store} from '@ngrx/store';
import {InvoicesBusinessService} from './invoices-business.service';
import {filter, map} from 'rxjs/operators';
import {AbstractTransactionBusinessService} from './abstract-transaction-business-service';
import {Contract, ContractItem, ContractItemFactory, ContractSummary, Invoice, NumberRangeFactory, Receiver} from 'jovisco-domain';

@Injectable()
export class ContractsBusinessService extends AbstractTransactionBusinessService<Contract, ContractSummary> {

  private nextId: string;

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
    return ContractItemFactory.fromData(data);
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
    return Contract.defaultValues();
  }

  protected getIsChangeableSelector(): Function {
    return fromStore.selectContractChangeable;
  }

  protected getIsDeletableSelector(): Function {
    return fromStore.selectContractChangeable;
  }

  protected getItemTemplate(): any {
    return ContractItem.defaultValues();
  }

  protected getNextId(object: Contract): string {
    return this.nextId;
  }

  protected getSummarySelector(): Function {
    return fromStore.selectContractSummariesAsSortedArray;
  }

  protected getTemplate(): any {
    return Contract.defaultValues();
  }

  private setNextIdFromNumberRange(): void {
    this.store.pipe(
      select(fromStore.selectNumberRangeEntities),
      filter(entities => !!entities['contracts']),
      map(entities => NumberRangeFactory.fromData(entities['contracts']).nextId),
    ).subscribe(nextId => this.nextId = nextId);
  }
}
