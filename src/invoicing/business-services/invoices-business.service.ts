import {Injectable} from '@angular/core';
import {concat, Observable, of, throwError} from 'rxjs/index';
import {Receiver} from '../models/receiver.model';
import * as fromStore from '../store/index';
import {Action, select, Store} from '@ngrx/store';
import {BillingMethod, InvoiceSummary, PaymentMethod} from '../models/invoicing.model';
import {Contract, ContractItem} from '../models/contract.model';
import {
  ChangeMode,
  Invoice,
  INVOICE_HEADER_CONTRACT_ID_CHANGED,
  INVOICE_HEADER_RECEIVER_ID_CHANGED,
  INVOICE_ITEM_CONTRACT_ITEM_ID_CHANGED,
  INVOICE_ITEM_ID_ADDED,
  InvoiceChange,
  InvoiceChangeAction,
  InvoiceData,
  InvoiceItem,
  InvoiceItemData,
  InvoiceStatus
} from '../models/invoice.model';
import {difference} from '../../shared/utilities/object-utilities';
import {NumberRange} from '../models/number-range.model';
import {Vat} from '../../admin/models/vat';
import {catchError, filter, map, retryWhen, switchMap, take, takeLast, tap} from 'rxjs/operators';
import {isEqual} from 'lodash';
import {DateUtilities} from '../../shared/utilities/date-utilities';
import {AbstractTransactionBusinessService} from './abstract-transaction-business-service';

@Injectable()
export class InvoicesBusinessService extends AbstractTransactionBusinessService<Invoice, InvoiceSummary> {

  private static template = {
    objectType: 'invoices',
    billingMethod: BillingMethod.Invoice,
    issuedAt: DateUtilities.getDateOnly(),
    status: InvoiceStatus.created,
    currency: 'EUR',
    vatPercentage: 19.0,
    paymentTerms: '30 Tage: netto',
    paymentMethod: PaymentMethod.BankTransfer,
    cashDiscountDays: 0,
    cashDiscountPercentage: 0,
    dueInDays: 30,
    organization: null,
    billingPeriod: null,
    internalText: null,
    invoiceText: null,
  } as InvoiceData;

  private static itemTemplate = {
    contractItemId: 0,
    quantity: 0,
    pricePerUnit: 0
  } as InvoiceItemData;

  private currentData: InvoiceData;
  private nextIds: string[];

  private static getDefaultValues(): any {
    return {
      id: undefined,
      issuedAt: DateUtilities.getDateOnly(),
      status: InvoiceStatus.created
    };
  }

  constructor(protected store: Store<fromStore.InvoicingState>) {
    super(store);
    this.setNextIdsFromNumberRanges();
  }

  change(invoice: Invoice) {
    this.processChanges(invoice).subscribe(changed => {
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
    return this.store.pipe(select(fromStore.selectSelectableContractsForInvoiceAsObjArray));
  }

  getCurrent(): Observable<Invoice> {
    return this.store.pipe(
      select(this.getCurrentSelector()),
      tap(current => this.currentData = current.data)
    );
  }

  getReceiver(): Observable<Receiver> {
    return this.store.pipe(select(fromStore.selectInvoiceReceiverAsObj));
  }

  getReceivers(): Observable<Receiver[]> {
    return this.store.pipe(select(fromStore.selectActiveReceiversSortedAsObjArray));
  }

  isSendable(): Observable<boolean> {
    return this.store.pipe(select(fromStore.isInvoiceSendable));
  }

  newInvoiceFromContract(contract: Contract): void {
    let data: InvoiceData = Object.assign({}, InvoicesBusinessService.template);
    data = this.setInvoiceHeaderFromContract(data, contract);
    // --- only create first item from contract item
    data = this.setInvoiceItemFromContract(data, contract);
    // --- get vat percentage
    const invoice = Invoice.createFromData(data);
    this.getVatPercentage(invoice).pipe(
      take(1),
      tap(percentage => invoice.vatPercentage = percentage),
      tap(() => this.store.dispatch(new fromStore.NewQuickInvoiceSuccess(invoice.data)))
    ).subscribe();
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
    return InvoiceItem.createFromData(data);
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

  protected getCurrentSelector(): Function {
    return fromStore.selectCurrentInvoiceAsObj;
  }

  protected getDefaultValues(): any {
    return InvoicesBusinessService.getDefaultValues();
  }

  protected getIsChangeableSelector(): Function {
    return fromStore.selectInvoiceChangeable;
  }

  protected getIsDeletableSelector(): Function {
    return fromStore.selectInvoiceChangeable;
  }

  protected getItemTemplate(): any {
    return InvoicesBusinessService.itemTemplate;
  }

  protected getNextId(invoice: Invoice): string {
    return this.nextIds[invoice.header.billingMethod];
  }

  protected getSummarySelector(): Function {
    return fromStore.selectInvoiceSummariesAsSortedArray;
  }

  protected getTemplate(): any {
    return InvoicesBusinessService.template;
  }

  private addContractItemRelatedData(invoice: Invoice, itemId: number): Observable<Invoice> {
    console.log('*** addContractItemRelatedData ***');
    const item = invoice.getItem(itemId);
    if (!item.contractItemId) {
      item.contractItemId = itemId;
    }
    return this.changeContractItemRelatedData(invoice, itemId).pipe(
      retryWhen((err) => {
        if (item.contractItemId > 1) {
          item.contractItemId--;
          return of(true);
        } else {
          throwError('contract_item_not_found');
        }
      })
    );
  }

  private changeContractItemRelatedData(invoice: Invoice, itemId: number): Observable<Invoice> {
    console.log('*** changeContractItemRelatedData ***');
    const item = invoice.getItem(itemId);
    if (item.contractItemId) {
      return this.getContracts().pipe(
        map(contracts => contracts.find(contract => contract.header.id === invoice.header.contractId)),
        map(contract => contract.getItem(+item.contractItemId)),
        map(contractItem => {
          this.mapContractItemToInvoice(contractItem, item);
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
      map(contracts => contracts.find(contract => contract.header.id === invoice.header.contractId)),
      map(contract => this.mapContractHeaderToInvoice(contract, invoice)),
      take(1),
      catchError(() => throwError('contract_not_found'))
    );
  }

  private changeReceiverRelatedData(invoice: Invoice): Observable<Invoice> {
    console.log('*** changeReceiverRelatedData ***: ');
    return this.getVatPercentage(invoice).pipe(
      map(percentage => {
        invoice.header.vatPercentage = percentage;
        return invoice;
      }),
      take(1),
      catchError(() => throwError('vat_not_found'))
    );
  }

  private getVatPercentage(invoice: Invoice): Observable<number> {
    const allReceivers$ = this.store.pipe(select(fromStore.selectReceiverEntities));
    const allVatSettings$ = this.store.pipe(select(fromStore.selectAllVatSettings));
    return allReceivers$.pipe(
      map(receivers => receivers[invoice.header.receiverId].address.country + '_full'),
      switchMap(taxCode => allVatSettings$
        .pipe(
          map(vatSettings => {
            const filtered = vatSettings.values
              .filter((vatSetting: Vat) => vatSetting.taxCode === taxCode)
              .filter((vatSetting: Vat) => vatSetting.validTo >= invoice.header.issuedAt)
              .sort((a: Vat, b: Vat) => a.validTo.getDate() - b.validTo.getDate());
            return filtered[0].percentage;
          }))),
      take(1)
    );
  }

  private processChanges(invoice: Invoice): Observable<Invoice> {
    const changes = this.determineChanges(invoice.data, this.currentData);
    const changeActions = changes.map(change => InvoiceChangeAction.createFromData(change, invoice));
    const operations = changeActions.map(action => {
      switch (action.type) {
        case INVOICE_HEADER_RECEIVER_ID_CHANGED:
          return this.changeReceiverRelatedData(action.payload);
        case INVOICE_HEADER_CONTRACT_ID_CHANGED:
          return this.changeContractRelatedData(action.payload);
        case INVOICE_ITEM_CONTRACT_ITEM_ID_CHANGED:
          return this.changeContractItemRelatedData(action.payload, +action.change.id);
        case INVOICE_ITEM_ID_ADDED:
          return this.addContractItemRelatedData(action.payload, +action.change.id);
        default:
          return of(invoice);
      }
    });
    return concat(...operations).pipe(takeLast(1));
  }

  private determineChanges(changed: InvoiceData, current: InvoiceData): InvoiceChange[] {
    const changes: InvoiceChange[] = [] as InvoiceChange[];
    // --- find differences
    const differences = difference(changed, current);
    if (Object.keys(differences).length === 0) {
      return changes;
    }
    // --- flatten into array
    Object.keys(differences).forEach(key => {
      if (key === 'items') {
        const itemChanges = this.determineItemChanges(differences[key], changed, current);
        changes.push(...itemChanges);
      } else {
        const change = {mode: ChangeMode.changed, object: 'header', field: key, value: differences[key]};
        changes.push(change);
      }
    });
    return changes;
  }

  private determineItemChanges(itemChanges: any[], changed: InvoiceData, current: InvoiceData): InvoiceChange[] {
    const changes: InvoiceChange[] = [] as InvoiceChange[];
    itemChanges.forEach((itemChange: Object, i: number) => {
      const itemId = changed.items[i].id;
      // --- determine change mode for item
      let mode = ChangeMode.changed;
      if (itemChange['id']) {
        const defaultPos = i + 1;
        if (itemId !== defaultPos) {
          mode = ChangeMode.moved;
          if (itemId > defaultPos) {
            const change = {mode: ChangeMode.deleted, object: 'item', id: current.items[i].id};
            changes.push(change);
          }
        } else {
          mode = ChangeMode.added;
          const change = {mode: ChangeMode.added, object: 'item', id: itemId, field: 'id', value: itemId};
          changes.push(change);
        }
      }
      // --- investigate field changes
      Object.keys(itemChange)
        .filter(fieldName => fieldName !== 'id')
        .forEach(fieldName => {
          if (mode === ChangeMode.moved) {
            // --- ignore movements without change
            const movedItem = changed.items.find(item => item.id === itemId);
            const oldItem = current.items.find(item => item.id === itemId);
            if (!isEqual(movedItem[fieldName], oldItem[fieldName])) {
              const change = {mode: ChangeMode.changed, object: 'item', id: itemId, field: fieldName, value: itemChange[fieldName]};
              changes.push(change);
            }
          } else {
            const change = {mode: mode, object: 'item', id: itemId, field: fieldName, value: itemChange[fieldName]};
            changes.push(change);
          }
        });
    });
    return changes;
  }

  private setNextIdsFromNumberRanges(): void {
    this.store.pipe(
      select(fromStore.selectNumberRangeEntities),
      filter(entities => !!entities['invoices'] && !!entities['credit-requests']),
      map(entities => {
        this.nextIds = [];
        this.nextIds.push(NumberRange.createFromData(entities['invoices']).nextId);
        this.nextIds.push(NumberRange.createFromData(entities['credit-requests']).nextId);
        return this.nextIds;
      })
    ).subscribe();
  }

  private mapContractHeaderToInvoice(contract: Contract, invoice: Invoice): Invoice {
    invoice.header.billingMethod = contract.header.billingMethod;
    invoice.header.paymentMethod = contract.header.paymentMethod;
    invoice.header.paymentTerms = contract.header.paymentTerms;
    invoice.header.cashDiscountPercentage = contract.header.cashDiscountPercentage;
    invoice.header.cashDiscountDays = contract.header.cashDiscountDays;
    invoice.header.dueInDays = contract.header.dueDays;
    invoice.header.invoiceText = contract.header.invoiceText;
    // invoice.header.internalText = contract.header.internalText;
    return invoice;
  }

  private mapContractItemToInvoice(contractItem: ContractItem, invoiceItem: InvoiceItem): void {
    invoiceItem.description = contractItem.description;
    invoiceItem.quantityUnit = contractItem.priceUnit;
    invoiceItem.pricePerUnit = contractItem.pricePerUnit;
    invoiceItem.cashDiscountAllowed = contractItem.cashDiscountAllowed;
  }

  private setInvoiceHeaderFromContract(data: InvoiceData, contract: Contract): InvoiceData {
    data.receiverId = contract.header.customerId;
    data.contractId = contract.header.id;
    data.billingMethod = contract.header.billingMethod;
    data.currency = contract.header.currency;
    data.cashDiscountDays = contract.header.cashDiscountDays;
    data.cashDiscountPercentage = contract.header.cashDiscountPercentage;
    data.dueInDays = contract.header.dueDays;
    data.paymentTerms = contract.header.paymentTerms;
    data.paymentMethod = contract.header.paymentMethod;
    data.invoiceText = contract.header.invoiceText;
    data.items = [];
    return data;
  }

  private setInvoiceItemFromContract(data: InvoiceData, contract: Contract): InvoiceData {
    const item = contract.items[0];
    data.items.push({
      id: 1,
      contractItemId: item.id,
      description: item.description,
      quantityUnit: item.priceUnit,
      pricePerUnit: item.pricePerUnit,
      cashDiscountAllowed: item.cashDiscountAllowed
    });
    return data;
  }
}
