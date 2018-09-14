import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Receiver, ReceiverData, ReceiverStatus} from '../models/receiver.model';
import * as fromStore from '../store/index';
import * as fromAuth from '../../auth/store';
import * as fromRoot from '../../app/store';
import {Store} from '@ngrx/store';
import {selectSelectedReceiver} from '../store/selectors';
import {ReceiverSummary} from '../models/invoicing.model';
import {Contract} from '../models/contract.model';
import {Invoice} from '../models/invoice.model';
import {NumberRange} from '../models/number-range.model';
import {UserData} from '../../auth/models/user';
import {SettingsBusinessService} from './settings-business.service';
import {Country} from '../models/country';
import {filter, map} from 'rxjs/operators';
import {InvoicesBusinessService} from './invoices-business.service';


@Injectable()
export class ReceiversBusinessService {

  private static template: ReceiverData = {
    objectType: 'receivers',
    status: ReceiverStatus.active,
    logoUrl: null,
    isDeletable: true,
    lastContractId: null,
    recentContractIds: null,
    lastInvoiceId: null,
    openInvoiceIds: null,
    address: {
      country: 'DE'
    }
  };

  private nextId: string;
  private auth: UserData;

  private static getDefaultValues(): any {
    return {
      id: undefined,
      isDeletable: true,
      lastContractId: null,
      recentContractIds: null,
      lastInvoiceId: null,
      openInvoiceIds: null
    };
  }

  constructor(private settings: SettingsBusinessService,
              private invoicesBusinessService: InvoicesBusinessService,
              private store: Store<fromStore.InvoicingState>) {
    this.store.select(fromAuth.selectAuth)
      .subscribe(auth => this.auth = auth);
    this.store.select(fromStore.selectNumberRangeEntities)
      .filter(entities => !!entities['receivers'])
      .map(entities => NumberRange.createFromData(entities['receivers']).nextId)
      .subscribe(nextId => this.nextId = nextId);
  }

  change(receiver: Receiver) {
    this.store.dispatch(new fromStore.ChangeReceiverSuccess(receiver.data));
  }

  copy(receiver: Receiver) {
    const data = Object.assign({}, receiver.data, ReceiversBusinessService.getDefaultValues(), { organization: this.auth.organization });
    this.store.dispatch(new fromStore.CopyReceiverSuccess(data));
  }

  create(receiver: Receiver) {
    receiver.header.id = this.nextId;
    receiver.header.organization = this.auth.organization;
    this.store.dispatch(new fromStore.CreateReceiver(receiver.data));
  }

  createQuickInvoice(receiver: Receiver) {
    this.store.select(fromStore.selectInvoiceableContractsForReceiverAsObjArray)
      .pipe(
        map(contracts => contracts.filter(contract => contract.isInvoiceable())),
        filter(contracts => contracts.length === 1),
        map(contracts => this.invoicesBusinessService.newInvoiceFromContract(contracts[0]))
      )
      .subscribe()
      .unsubscribe();
  }

  delete(receiver: Receiver) {
    this.store.dispatch(new fromRoot.OpenConfirmationDialog({
      do: new fromStore.DeleteReceiver(receiver.data),
      title: `Soll der Rechnungsempfänger ${receiver.header.id} wirklich gelöscht werden?`
    }));
   // this.store.dispatch(new fromStore.DeleteReceiver(receiver.data));
  }

  getActiveContracts(): Observable<Contract[]> {
    return this.store.select(fromStore.selectActiveContractsForReceiverAsObjArray);
  }

  getCountries(): Observable<Country[]> {
    return this.settings.getCountries();
  }

  getCurrent(): Observable<Receiver> {
    return this.store.select(fromStore.selectCurrentReceiverAsObj);
  }

  getRecentContracts(): Observable<Contract[]> {
    return this.store.select(fromStore.selectRecentContractsForReceiverAsObjArray);
  }

  getOpenInvoices(): Observable<Invoice[]> {
    return this.store.select(fromStore.selectOpenInvoicesForReceiverAsObjArray);
  }

  getSummary(): Observable<ReceiverSummary[]> {
    return this.store.select(fromStore.selectReceiverSummariesAsArray);
  }

  isDeletable(): Observable<boolean> {
    return this.getCurrent()
      .map(receiver => receiver.header.isDeletable);
  }

  isQualifiedForQuickInvoice(): Observable<boolean> {
    return this.store.select(fromStore.isReceiverQualifiedForQuickInvoice);
  }

  new() {
    const data = Object.assign({}, ReceiversBusinessService.template);
    this.store.dispatch(new fromStore.NewReceiverSuccess(data));
  }

  query(): Observable<ReceiverData[]> {
    return this.store.select(fromStore.selectAllReceivers);
  }

  select(id: number): Observable<ReceiverData> {
    return this.store.select(selectSelectedReceiver);
  }

  update(receiver: Receiver) {
    this.store.dispatch(new fromStore.UpdateReceiver(receiver.data));
  }
}
