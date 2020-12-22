import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs/index';
import * as fromStore from '../store';
import { Action, select, Store } from '@ngrx/store';
import {
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  retryWhen,
  switchMap,
  take,
  takeLast,
  tap,
} from 'rxjs/operators';
import { AbstractTransactionBusinessService } from './abstract-transaction-business-service';
import {
  Contract,
  Invoice,
  INVOICE_HEADER_CONTRACT_ID_CHANGED,
  INVOICE_HEADER_RECEIVER_ID_CHANGED,
  INVOICE_ITEM_CONTRACT_ITEM_ID_CHANGED,
  INVOICE_ITEM_ID_ADDED,
  InvoiceChangeAction,
  InvoiceChangeActionFactory,
  InvoiceData,
  InvoiceFactory,
  InvoiceItem,
  InvoiceItemFactory,
  InvoiceSummary,
  NumberRangeFactory,
  Receiver,
  Vat,
} from 'jovisco-domain';

@Injectable()
export class InvoicesBusinessService extends AbstractTransactionBusinessService<
  Invoice,
  InvoiceSummary
> {
  private nextIds: string[];
  private currentData: InvoiceData = Invoice.defaultValues();

  constructor(protected store: Store<fromStore.InvoicingState>) {
    super(store);
    this.setNextIdsFromNumberRanges();
  }

  change(invoice: Invoice) {
    this.processChanges(invoice).subscribe((changed) => {
      console.log('changed: ', changed);
      this.currentData = changed.data;
      this.store.dispatch(this.buildChangeSuccessEvent(changed.data));
    });
  }

  createPdf(invoice: Invoice) {
    this.store.dispatch(new fromStore.CreateInvoicePdf(invoice.data));
  }

  getContract(): Observable<Contract> {
    return this.store.pipe(select(fromStore.selectInvoiceContractAsObj));
  }

  getContracts(): Observable<Contract[]> {
    return this.store.pipe(
      select(fromStore.selectSelectableContractsForInvoiceAsObjArray)
    );
  }

  getCurrent(): Observable<Invoice> {
    return this.store.pipe(select(this.getCurrentSelector()));
  }

  getReceiver(): Observable<Receiver> {
    return this.store.pipe(select(fromStore.selectInvoiceReceiverAsObj));
  }

  getReceivers(): Observable<Receiver[]> {
    return this.store.pipe(
      select(fromStore.selectActiveReceiversSortedAsObjArray)
    );
  }

  isSendable(): Observable<boolean> {
    return this.store.pipe(select(fromStore.isInvoiceSendable));
  }

  newInvoiceFromContract(contract: Contract): void {
    const invoice = InvoiceFactory.fromContract(contract);
    // --- get vat percentage
    this.getVatPercentage(invoice)
      .pipe(
        take(1),
        tap((percentage) => {
          invoice.vatPercentage = percentage;
          invoice.items.forEach((item) => (item.vatPercentage = percentage));
        }),
        tap(() =>
          this.store.dispatch(
            new fromStore.NewQuickInvoiceSuccess(invoice.data)
          )
        )
      )
      .subscribe();
  }

  sendEmail(invoice: Invoice) {
    this.store.dispatch(new fromStore.SendInvoiceEmail(invoice.data));
  }

  protected buildChangeSuccessEvent(data: any): Action {
    return new fromStore.ChangeInvoiceSuccess(data);
  }

  protected buildCopySuccessEvent(data: any): Action {
    return new fromStore.CopyInvoiceSuccess(data);
  }

  protected buildCreateCommand(data: any): Action {
    return new fromStore.CreateInvoice(data);
  }

  protected buildDeleteCommand(data: any): Action {
    return new fromStore.DeleteInvoice(data);
  }

  protected buildItem(data: any): InvoiceItem {
    return InvoiceItemFactory.fromData(data);
  }

  protected buildNewEvent(data: any): Action {
    return new fromStore.NewInvoiceSuccess(data);
  }

  protected buildUpdateCommand(data: any): Action {
    return new fromStore.UpdateInvoice(data);
  }

  protected getConfirmationQuestion(id: string): string {
    return `Soll die Rechnung ${id} wirklich gelöscht werden?`;
  }

  protected getCurrentSelector(): any {
    return fromStore.selectCurrentInvoiceAsObj;
  }

  protected getDefaultValues(): any {
    return Invoice.defaultValues();
  }

  protected getIsChangeableSelector(): any {
    return fromStore.selectInvoiceChangeable;
  }

  protected getIsDeletableSelector(): any {
    return fromStore.selectInvoiceChangeable;
  }

  protected getItemTemplate(): any {
    return InvoiceItem.defaultValues();
  }

  protected getNextId(invoice: Invoice): string {
    return this.nextIds[invoice.header.billingMethod];
  }

  protected getSummarySelector(): Function {
    return fromStore.selectInvoiceSummariesAsSortedArray;
  }

  protected getTemplate(): any {
    return Invoice.defaultValues();
  }

  private addContractItemRelatedData(
    invoice: Invoice,
    itemId: number
  ): Observable<Invoice> {
    console.log('*** addContractItemRelatedData ***');
    const item = invoice.getItem(itemId);
    if (!item.contractItemId) {
      item.contractItemId = itemId;
    }
    return this.changeContractItemRelatedData(invoice, itemId).pipe(
      retryWhen((_) => {
        if (item.contractItemId > 1) {
          item.contractItemId--;
          return of(true);
        } else {
          throwError('contract_item_not_found');
        }
      })
    );
  }

  private changeContractItemRelatedData(
    invoice: Invoice,
    itemId: number
  ): Observable<Invoice> {
    console.log('*** changeContractItemRelatedData ***');
    const item = invoice.getItem(itemId);
    if (item.contractItemId) {
      return this.getContracts().pipe(
        map((contracts) =>
          contracts.find(
            (contract) => contract.header.id === invoice.header.contractId
          )
        ),
        map((contract) => contract.getItem(+item.contractItemId)),
        map((contractItem) => {
          item.setItemDataFromContractItem(contractItem);
          return invoice;
        }),
        take(1),
        catchError(() => throwError('contract_not_found'))
      );
    } else {
      return of(invoice);
    }
  }

  private changeContractRelatedData(invoice: Invoice): Observable<Invoice> {
    console.log('*** changeContractRelatedData *** ');
    return this.getContracts().pipe(
      map((contracts) =>
        contracts.find(
          (contract) => contract.header.id === invoice.header.contractId
        )
      ),
      map((contract) => invoice.setHeaderDataFromContract(contract)),
      take(1),
      catchError(() => throwError('contract_not_found'))
    );
  }

  private changeReceiverRelatedData(invoice: Invoice): Observable<Invoice> {
    console.log('*** changeReceiverRelatedData ***: ');
    return this.getVatPercentage(invoice).pipe(
      map((percentage) => invoice.setVatPercentage(percentage)),
      take(1),
      catchError(() => throwError('vat_not_found'))
    );
  }

  private getVatPercentage(invoice: Invoice): Observable<number> {
    const allReceivers$ = this.store.pipe(
      select(fromStore.selectReceiverEntities)
    );
    const allVatSettings$ = this.store.pipe(
      select(fromStore.selectAllVatSettings)
    );
    return allReceivers$.pipe(
      map(
        (receivers) =>
          receivers[invoice.header.receiverId].address.country + '_full'
      ),
      switchMap((taxCode) =>
        allVatSettings$.pipe(
          map((vatSettings) =>
            Vat.findVatPercentage(vatSettings, taxCode, invoice.header.issuedAt)
          )
        )
      ),
      take(1)
    );
  }

  private processChangeAction(
    action: InvoiceChangeAction,
    invoice: Invoice
  ): Observable<Invoice> {
    console.log('process change action: ', action.type);
    switch (action.type) {
      case INVOICE_HEADER_RECEIVER_ID_CHANGED:
        return this.changeReceiverRelatedData(action.payload);
      case INVOICE_HEADER_CONTRACT_ID_CHANGED:
        return this.changeContractRelatedData(action.payload);
      case INVOICE_ITEM_CONTRACT_ITEM_ID_CHANGED:
        return this.changeContractItemRelatedData(
          action.payload,
          +action.change.id
        );
      case INVOICE_ITEM_ID_ADDED:
        return this.addContractItemRelatedData(
          action.payload,
          +action.change.id
        );
      default:
        return of(invoice);
    }
  }

  private processChanges(invoice: Invoice): Observable<Invoice> {
    return of(this.currentData).pipe(
      map((current) => {
        const changeActionFactory = new InvoiceChangeActionFactory(
          current,
          invoice
        );
        const changeActions = changeActionFactory.getChangeActions();
        console.log('change actions: ', changeActions);
        return changeActions;
      }),
      concatMap((actions) =>
        actions.map((action) => this.processChangeAction(action, invoice))
      ),
      filter((results) => !!results),
      mergeMap((results) => {
        console.log('mergeMap results: ', results);
        return results;
      }),
      takeLast(1)
    );
  }

  private setNextIdsFromNumberRanges(): void {
    this.store
      .pipe(
        select(fromStore.selectNumberRangeEntities),
        filter(
          (entities) => !!entities['invoices'] && !!entities['credit-requests']
        ),
        map((entities) => {
          this.nextIds = [];
          this.nextIds.push(
            NumberRangeFactory.fromData(entities['invoices']).nextId
          );
          this.nextIds.push(
            NumberRangeFactory.fromData(entities['credit-requests']).nextId
          );
          return this.nextIds;
        })
      )
      .subscribe();
  }
}
