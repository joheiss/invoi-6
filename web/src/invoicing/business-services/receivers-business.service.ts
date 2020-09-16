import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import * as fromStore from '../store';
import {Action, select, Store} from '@ngrx/store';
import {SettingsBusinessService} from '../../admin/business-services';
import {filter, map, take} from 'rxjs/operators';
import {InvoicesBusinessService} from './invoices-business.service';
import {AbstractBoBusinessService} from './abstract-bo-business.service';
import {Contract, CountryData, Invoice, NumberRangeFactory, Receiver, ReceiverSummary} from 'jovisco-domain';

@Injectable()
export class ReceiversBusinessService extends AbstractBoBusinessService<Receiver, ReceiverSummary> {

  private nextId: string;

  constructor(private settings: SettingsBusinessService,
              private invoicesBusinessService: InvoicesBusinessService,
              protected store: Store<fromStore.InvoicingState>) {
    super(store);
    this.setNextIdFromNumberRange();
  }

  createQuickInvoice(receiver: Receiver) {
    this.store.pipe(
      select(fromStore.selectInvoiceableContractsForReceiverAsObjArray),
      map(contracts => contracts.filter(contract => contract.term.isInvoiceable)),
      filter(contracts => contracts.length === 1),
      map(contracts => this.invoicesBusinessService.newInvoiceFromContract(contracts[0])),
      take(1)
    )
      .subscribe();
  }

  getActiveContracts(): Observable<Contract[]> {
    return this.store.pipe(select(fromStore.selectActiveContractsForReceiverAsObjArray));
  }

  getCountries(): Observable<CountryData[]> {
    return this.settings.getCountries();
  }

  getLastInvoices(): Observable<Invoice[]> {
    return this.store.pipe(select(fromStore.selectLastInvoicesForReceiverAsObjArray));
  }

  getOpenInvoices(): Observable<Invoice[]> {
    return this.store.pipe(select(fromStore.selectOpenInvoicesForReceiverAsObjArray));
  }

  getRecentContracts(): Observable<Contract[]> {
    return this.store.pipe(select(fromStore.selectRecentContractsForReceiverAsObjArray));
  }

  isQualifiedForQuickInvoice(): Observable<boolean> {
    return this.store.pipe(select(fromStore.isReceiverQualifiedForQuickInvoice));
  }

  protected buildChangeSuccessEvent(data: any): Action {
    return new fromStore.ChangeReceiverSuccess(data);
  }

  protected buildCopySuccessEvent(data: any): Action {
    return new fromStore.CopyReceiverSuccess(data);
  }

  protected buildCreateCommand(data: any): Action {
    return new fromStore.CreateReceiver(data);
  }

  protected buildDeleteCommand(data: any): Action {
    return new fromStore.DeleteReceiver(data);
  }

  protected buildNewEvent(data: any): Action {
    return new fromStore.NewReceiverSuccess(data);
  }

  protected buildUpdateCommand(data: any): Action {
    return new fromStore.UpdateReceiver(data);
  }

  protected getConfirmationQuestion(id: string): string {
    return `Soll der Rechnungsempfänger ${id} wirklich gelöscht werden?`;
  }

  protected getCurrentSelector(): Function {
    return fromStore.selectCurrentReceiverAsObj;
  }

  protected getDefaultValues(): any {
    return Receiver.defaultValues();
  }

  protected getIsChangeableSelector(): Function {
    return fromStore.isReceiverDeletable;
  }

  protected getIsDeletableSelector(): Function {
    return fromStore.isReceiverDeletable;
  }

  protected getNextId(object: Receiver): string {
    return this.nextId;
  }

  protected getSummarySelector(): Function {
    return fromStore.selectReceiverSummariesAsArray;
  }

  protected getTemplate(): any {
    return Receiver.defaultValues();
  }

  private setNextIdFromNumberRange(): void {
    this.store.pipe(
      select(fromStore.selectNumberRangeEntities),
      filter(entities => !!entities['receivers']),
      map(entities => NumberRangeFactory.fromData(entities['receivers']).nextId)
    ).subscribe(nextId => this.nextId = nextId);
  }

}
