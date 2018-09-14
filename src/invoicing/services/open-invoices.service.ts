import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ObjectsApiService, OrderByOption} from './objects-api.service';
import {OpenInvoiceData} from '../models/open-invoice.model';

@Injectable()
export class OpenInvoicesService extends ObjectsApiService<OpenInvoiceData> {

  static readonly COLLECTION_NAME = 'open-invoices';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'dueDate', direction: 'asc' };

  constructor(protected afs: AngularFirestore) {
     super(afs, OpenInvoicesService.COLLECTION_NAME, OpenInvoicesService.COLLECTION_ORDERBY);
  }
}
