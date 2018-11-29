import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {InvoiceData} from '../models/invoice.model';
import {ObjectsApiService} from './objects-api.service';
import {OrderByOption} from '../../shared/models/order-by-option';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {FbFunctionsService} from '../../shared/services/fb-functions.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService extends ObjectsApiService<InvoiceData> {

  static readonly COLLECTION_NAME = 'invoices';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'issuedAt', direction: 'desc' };

  constructor(private fbFunctions: FbFunctionsService,
              protected fbStore: FbStoreService) {
    super(fbStore, InvoicesService.COLLECTION_NAME, InvoicesService.COLLECTION_ORDERBY);
  }

  createInvoicePDF(payload: InvoiceData): Observable<InvoiceData> {
    return this.fbFunctions.createInvoicePDF(payload);
  }

  sendInvoiceEmail(payload: InvoiceData): Observable<InvoiceData> {
    return this.fbFunctions.sendInvoiceEmail(payload);
  }
}
