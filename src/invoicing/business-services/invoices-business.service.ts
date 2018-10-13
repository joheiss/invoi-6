import {Injectable} from '@angular/core';
import {concat, Observable, of, throwError} from 'rxjs/index';
import {Receiver} from '../models/receiver.model';
import * as fromStore from '../store/index';
import {select, Store} from '@ngrx/store';
import {BillingMethod, InvoiceSummary, PaymentMethod} from '../models/invoicing.model';
import {Contract} from '../models/contract.model';
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
import * as fromAuth from '../../auth/store';
import {UserData} from '../../auth/models/user';
import {Vat} from '../models/vat';
import {catchError, filter, first, map, retryWhen, switchMap, take, takeLast, tap} from 'rxjs/operators';
import * as fromRoot from '../../app/store';
import {isEqual} from 'lodash';
import * as util from 'util';

@Injectable()
export class InvoicesBusinessService {
  /* ------------------------- */
  /* --- STATIC ATTRIBUTES --- */
  /* ------------------------- */
  private static template = {
    objectType: 'invoices',
    billingMethod: BillingMethod.Invoice,
    issuedAt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
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

  /* --------------------------- */
  /* --- INSTANCE ATTRIBUTES --- */
  /* --------------------------- */
  private currentData: InvoiceData;
  private nextIds: string[];
  private auth: UserData;

  /* --------------------------- */
  /* --- STATIC METHODS      --- */

  /* --------------------------- */
  private static getDefaultValues(): any {
    const today = new Date();
    return {
      id: undefined,
      issuedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      status: InvoiceStatus.created,
      documentUrl: null,
      documentLinks: null
    };
  }

  /* --------------------------- */
  /* --- CONSTRUCTOR         --- */

  /* --------------------------- */
  constructor(private store: Store<fromStore.InvoicingState>) {
    // get current user
    this.store.pipe(
      select(fromAuth.selectAuth),
      first()
    )
      .subscribe(auth => this.auth = auth);
    // get number ranges for invoices & credit requests
    this.store.pipe(
      select(fromStore.selectNumberRangeEntities),
      filter(entities => !!entities['invoices'] && !!entities['credit-requests'])
    )
      .subscribe(entities => {
        this.nextIds = [];
        this.nextIds.push(NumberRange.createFromData(entities['invoices']).nextId);
        this.nextIds.push(NumberRange.createFromData(entities['credit-requests']).nextId);
        console.log('invoice next Ids: ', this.nextIds);
      });
  }

  /* --------------------------- */
  /* --- INSTANCE METHODS    --- */

  /* --------------------------- */
  addItem(invoice: Invoice) {
    invoice.items.push(this.newItem(invoice));
    this.change(invoice);
  }

  change(invoice: Invoice) {
    this.processChanges(invoice).subscribe(changed => {
      console.log('changed: ', changed);
      this.currentData = changed.data;
      this.store.dispatch(new fromStore.ChangeInvoiceSuccess(changed.data));
    });
  }

  copy(invoice: Invoice) {
    const data = Object.assign({}, invoice.data, {...InvoicesBusinessService.getDefaultValues()}, {organization: this.auth.organization});
    this.store.dispatch(new fromStore.CopyInvoiceSuccess(data));
  }

  create(invoice: Invoice) {
    invoice.header.id = this.getNextId(invoice);
    console.log('new invoice id: ', invoice.header.id);
    invoice.header.organization = this.auth.organization;
    this.store.dispatch(new fromStore.CreateInvoice(invoice.data));
  }

  createPdf(invoice: Invoice) {
    this.store.dispatch(new fromStore.CreateInvoicePdf(invoice.data));
  }

  delete(invoice: Invoice) {
    this.store.dispatch(new fromRoot.OpenConfirmationDialog({
      do: new fromStore.DeleteInvoice(invoice.data),
      title: `Soll die Rechnung ${invoice.header.id} wirklich gelöscht werden?`
    }));
  }

  getContract(): Observable<Contract> {
    return this.store.pipe(select(fromStore.selectInvoiceContractAsObj));
  }

  getContracts(): Observable<Contract[]> {
    return this.store.pipe(select(fromStore.selectSelectableContractsForInvoiceAsObjArray));
  }

  getCurrent(): Observable<Invoice> {
    return this.store.pipe(
      select(fromStore.selectCurrentInvoiceAsObj),
      first(),
      tap(current => this.currentData = current.data)
    );
  }

  getNextId(invoice: Invoice): string {
    return this.nextIds[invoice.header.billingMethod];
  }

  getReceiver(): Observable<Receiver> {
    return this.store.pipe(select(fromStore.selectInvoiceReceiverAsObj));
  }

  getReceivers(): Observable<Receiver[]> {
    return this.store.pipe(select(fromStore.selectActiveReceiversSortedAsObjArray));
  }

  getSummary(): Observable<InvoiceSummary[]> {
    return this.store.pipe(select(fromStore.selectInvoiceSummariesAsSortedArray));
  }

  isChangeable(): Observable<boolean> {
    return this.store.pipe(select(fromStore.selectInvoiceChangeable));
  }

  isDeletable(): Observable<boolean> {
    return this.store.pipe(select(fromStore.selectInvoiceChangeable));
  }

  isSendable(): Observable<boolean> {
    return this.store.pipe(select(fromStore.selectInvoiceSendable));
  }

  new() {
    const data = Object.assign({}, InvoicesBusinessService.template);
    this.store.dispatch(new fromStore.NewInvoiceSuccess(data));
  }

  async newInvoiceFromContract(contract: Contract): Promise<void> {
    // --- prepare invoice from contract
    console.log('about to prepare invoice with receiver & contract: ', contract);
    const data = Object.assign({}, InvoicesBusinessService.template);
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
    // --- only create first item from contract item
    data.items = [];
    const item = contract.items[0];
    data.items.push({
      id: 1,
      contractItemId: item.id,
      description: item.description,
      quantityUnit: item.priceUnit,
      pricePerUnit: item.pricePerUnit,
      cashDiscountAllowed: item.cashDiscountAllowed
    });
    // --- get vat percentage
    const invoice = Invoice.createFromData(data);
    await this.getVatPercentage(invoice).pipe(
      take(1),
      tap(percentage => invoice.vatPercentage = percentage),
      // tap(() => this.store.dispatch(new fromStore.NewQuickInvoiceSuccess(invoice.data)))
    )
      .subscribe();
    return this.store.dispatch(new fromStore.NewQuickInvoiceSuccess(invoice.data));
  }

  newItem(invoice: Invoice): InvoiceItem {
    const itemData = Object.assign({}, {id: invoice.getNextItemId()}, {...InvoicesBusinessService.itemTemplate}) as InvoiceItemData;
    return InvoiceItem.createFromData(itemData);
  }

  removeItem(invoice: Invoice, itemId: number) {
    invoice.items = invoice.items.filter(item => item.data.id !== itemId);
    this.change(invoice);
  }

  select(): Observable<InvoiceData> {
    return this.store.pipe(select(fromStore.selectSelectedInvoice));
  }

  sendEmail(invoice: Invoice) {
    console.log('dispatch email action for: ', invoice.header.id);
    this.store.dispatch(new fromStore.SendInvoiceEmail(invoice.data));
  }

  update(invoice: Invoice) {
    this.store.dispatch(new fromStore.UpdateInvoice(invoice.data));
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
          item.description = contractItem.description;
          item.quantityUnit = contractItem.priceUnit;
          item.pricePerUnit = contractItem.pricePerUnit;
          item.cashDiscountAllowed = contractItem.cashDiscountAllowed;
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
      map(contract => {
        console.log('contract found: ', contract.header.id, contract.header.invoiceText);
        invoice.header.billingMethod = contract.header.billingMethod;
        invoice.header.paymentMethod = contract.header.paymentMethod;
        invoice.header.paymentTerms = contract.header.paymentTerms;
        invoice.header.cashDiscountPercentage = contract.header.cashDiscountPercentage;
        invoice.header.cashDiscountDays = contract.header.cashDiscountDays;
        invoice.header.dueInDays = contract.header.dueDays;
        invoice.header.invoiceText = contract.header.invoiceText;
        // invoice.header.internalText = contract.header.internalText;
        return invoice;
      }),
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

    // --- determine changes
    const changes = this.determineChanges(invoice.data, this.currentData);
    const changeActions = changes.map(change => InvoiceChangeAction.createFromData(change, invoice));
    const operations = changeActions.map(action => {
      console.log('InvoiceChangeAction: ', action.type);
      switch (action.type) {
        case INVOICE_HEADER_RECEIVER_ID_CHANGED: {
          console.log('handle change of receiver id');
          return this.changeReceiverRelatedData(action.payload);
        }
        case INVOICE_HEADER_CONTRACT_ID_CHANGED: {
          console.log('handle change of contract id');
          return this.changeContractRelatedData(action.payload);
        }
        case INVOICE_ITEM_CONTRACT_ITEM_ID_CHANGED: {
          console.log('handle change of contract item id');
          return this.changeContractItemRelatedData(action.payload, +action.change.id);
        }
        case INVOICE_ITEM_ID_ADDED: {
          console.log('handle addition item id');
          return this.addContractItemRelatedData(action.payload, +action.change.id);
        }
        default:
          console.log('handle other changes');
          return of(invoice);
      }
    });

    console.log('# operations: ', operations.length);
    return concat(...operations).pipe(takeLast(1));
  }

  private determineChanges(changed: InvoiceData, current: InvoiceData): InvoiceChange[] {

    const changes: InvoiceChange[] = [] as InvoiceChange[];
    // --- find differences
    const differences = difference(changed, current);
    if (Object.keys(differences).length === 0) {
      return changes;
    }
    console.log('*** changes found ***: ', util.inspect(differences));

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

      Object.keys(itemChange).forEach(fieldName => {
        if (fieldName !== 'id') {
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
        }
      });
    });
    return changes;
  }

}
