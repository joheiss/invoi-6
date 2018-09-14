import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {Receiver} from '../models/receiver.model';
import * as fromStore from '../store/index';
import {Store} from '@ngrx/store';
import {BillingMethod, InvoiceSummary, PaymentMethod} from '../models/invoicing.model';
import {Contract} from '../models/contract.model';
import {Invoice, InvoiceData, InvoiceItem, InvoiceItemData, InvoiceStatus} from '../models/invoice.model';
import {difference} from '../../shared/utilities/object-utilities';
import {NumberRange} from '../models/number-range.model';
import * as fromAuth from '../../auth/store';
import {UserData} from '../../auth/models/user';
import {SettingsBusinessService} from './settings-business.service';
import {Vat} from '../models/vat';
import {map, switchMap, take} from 'rxjs/operators';
import * as fromRoot from '../../app/store';
import {filter} from 'rxjs/internal/operators';

@Injectable()
export class InvoicesBusinessService {
  /* ------------------------- */
  /* --- STATIC ATTRIBUTES --- */
  /* ------------------------- */
  private static template = {
    objectType: 'invoices',
    billingMethod: BillingMethod.Invoice,
    issuedAt: new Date(),
    status: InvoiceStatus.created,
    currency: 'EUR',
    vatPercentage: 19.0,
    paymentTerms: '30 Tage: netto',
    paymentMethod: PaymentMethod.BankTransfer,
    cashDiscountDays: 0,
    cashDiscountPercentage: 0,
    dueInDays: 30,
    documentLinks: null
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
      issuedAt: today,
      status: InvoiceStatus.created,
      documentUrl: null,
      documentLinks: null
    };
  }

  /* --------------------------- */
  /* --- STATIC METHODS      --- */
  /* --------------------------- */
  constructor(private store: Store<fromStore.InvoicingState>,
              private settings: SettingsBusinessService) {
    this.store.select(fromAuth.selectAuth)
      .subscribe(auth => this.auth = auth);
    this.store.select(fromStore.selectNumberRangeEntities).pipe(
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
    this.processChanges(invoice);
    this.currentData = invoice.data;
    this.store.dispatch(new fromStore.ChangeInvoiceSuccess(invoice.data));
  }

  copy(invoice: Invoice) {
    const data = Object.assign({}, invoice.data, {...InvoicesBusinessService.getDefaultValues()}, {organization: this.auth.organization});
    this.store.dispatch(new fromStore.CopyInvoiceSuccess(data));
  }

  create(invoice: Invoice) {
    invoice.header.id = this.getNextId(invoice);
    console.log('New Invoice ID: ', invoice.header.id);
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
    // this.store.dispatch(new fromStore.DeleteInvoice(invoice.data));
  }

  getContract(): Observable<Contract> {
    return this.store.select(fromStore.selectInvoiceContractAsObj);
  }

  getContracts(): Observable<Contract[]> {
    return this.store.select(fromStore.selectSelectableContractsForInvoiceAsObjArray);
  }

  getCurrent(): Observable<Invoice> {
    const current$ = this.store.select(fromStore.selectCurrentInvoiceAsObj);
    const sub = current$
      .subscribe(current => this.currentData = current.data)
      .unsubscribe();
    return current$;
  }

  getNextId(invoice: Invoice): string {
    return this.nextIds[invoice.header.billingMethod];
  }

  getReceiver(): Observable<Receiver> {
    return this.store.select(fromStore.selectInvoiceReceiverAsObj);
  }

  getReceivers(): Observable<Receiver[]> {
    return this.store.select(fromStore.selectActiveReceiversSortedAsObjArray);
  }

  getSummary(): Observable<InvoiceSummary[]> {
    return this.store.select(fromStore.selectInvoiceSummariesAsSortedArray);
  }

  isChangeable(): Observable<boolean> {
    return this.store.select(fromStore.selectInvoiceChangeable);
  }

  isDeletable(): Observable<boolean> {
    return this.store.select(fromStore.selectInvoiceChangeable);
  }

  isSendable(): Observable<boolean> {
    return this.store.select(fromStore.selectInvoiceSendable);
  }

  new() {
    const data = Object.assign({}, InvoicesBusinessService.template);
    this.store.dispatch(new fromStore.NewInvoiceSuccess(data));
  }

  newInvoiceFromContract(contract: Contract): void {
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
    this.getVatPercentage(invoice).subscribe(percentage => {
      invoice.vatPercentage = percentage;
      // --- navigate to invoice form
      return this.store.dispatch(new fromStore.NewQuickInvoiceSuccess(invoice.data));
    });
  }

  newItem(invoice: Invoice): InvoiceItem {
    const itemData = Object.assign({}, {id: invoice.getNextItemId()}, {...InvoicesBusinessService.itemTemplate}) as InvoiceItemData;
    return InvoiceItem.createFromData(itemData);
  }

  removeItem(invoice: Invoice, itemId: number) {
    invoice.items = invoice.items.filter(item => item.data.id !== itemId);
    this.change(invoice);
  }

  select(id: number): Observable<InvoiceData> {
    return this.store.select(fromStore.selectSelectedInvoice);
  }

  sendEmail(invoice: Invoice) {
    console.log('dispatch email action for: ', invoice.header.id);
    this.store.dispatch(new fromStore.SendInvoiceEmail(invoice.data));
  }

  update(invoice: Invoice) {
    this.store.dispatch(new fromStore.UpdateInvoice(invoice.data));
  }

  private changeContractItemRelatedData(invoice: Invoice, itemId: number): Invoice {
    console.log('*** changeContractItemRelatedData');
    const item = invoice.getItem(itemId);
    if (item.contractItemId) {
      console.log('Item.contractItemId: ', item.contractItemId);
      this.store.select(fromStore.selectSelectableContractsForInvoiceAsObjArray)
        .subscribe(contracts => {
          const contract = contracts.find(contract => contract.header.id === invoice.header.contractId);
          if (contract) {
            console.log('contract: ', contract);
            console.log('type of item.contractItemId: ', typeof item.contractItemId);
            const contractItem = contract.getItem(+item.contractItemId);
            if (contractItem) {
              console.log('contractItem: ', contractItem);
              item.description = contractItem.description;
              item.quantityUnit = contractItem.priceUnit;
              item.pricePerUnit = contractItem.pricePerUnit;
              item.cashDiscountAllowed = contractItem.cashDiscountAllowed;
            }
          }
        })
        .unsubscribe();
    }
    return invoice;
  }

  private changeContractRelatedData(invoice: Invoice): Invoice {
    console.log('Change contract related data: ', invoice);
    this.store.select(fromStore.selectSelectableContractsForInvoiceAsObjArray)
      .subscribe(contracts => {
        const contract = contracts.find(contract => contract.header.id === invoice.header.contractId);
        if (contract) {
          invoice.header.billingMethod = contract.header.billingMethod;
          invoice.header.paymentMethod = contract.header.paymentMethod;
          invoice.header.paymentTerms = contract.header.paymentTerms;
          invoice.header.cashDiscountPercentage = contract.header.cashDiscountPercentage;
          invoice.header.cashDiscountDays = contract.header.cashDiscountDays;
          invoice.header.dueInDays = contract.header.dueDays;
          invoice.header.invoiceText = contract.header.invoiceText;
          invoice.header.internalText = contract.header.internalText;
        }
      })
      .unsubscribe();
    return invoice;
  }

  private async changeReceiverRelatedData(invoice: Invoice): Promise<Invoice> {
    console.log('Change receiver related data: ', invoice);
    invoice.header.vatPercentage = await this.getVatPercentage(invoice).toPromise();
    return invoice;
  }

  private processChanges(invoice: Invoice) {
    const changed = difference(invoice.data, this.currentData);
    console.log('changes found: ', changed);
    Object.keys(changed)
      .forEach(key => {
        switch (key) {
          case 'receiverId':
            return this.changeReceiverRelatedData(invoice);
          case 'contractId':
            return this.changeContractRelatedData(invoice);
          case 'items':
            changed[key].forEach((itemChange: Object, i: number) => {
              console.log(`Item changed (${i}): `, itemChange);
              const itemId = invoice.items[i].id;
              Object.keys(itemChange).forEach(fieldName => {
                console.log('changed item field: ', fieldName);
                switch (fieldName) {
                  case 'contractItemId':
                    return this.changeContractItemRelatedData(invoice, itemId);
                  default:
                }
              });
            });
            break;
          default:
        }
      });
  }

  private getVatPercentage(invoice: Invoice): Observable<number> {
    const allReceivers$ = this.store.select(fromStore.selectReceiverEntities);
    const allVatSettings$ = this.store.select(fromStore.selectAllVatSettings);

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
}
