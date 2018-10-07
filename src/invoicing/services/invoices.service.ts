import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {catchError, tap} from 'rxjs/operators';
import {InvoiceData} from '../models/invoice.model';
import {AngularFirestore} from 'angularfire2/firestore';
import {ObjectsApiService, OrderByOption} from './objects-api.service';
import {environment} from '../../environments/environment';

@Injectable()
export class InvoicesService extends ObjectsApiService<InvoiceData> {

  static readonly COLLECTION_NAME = 'invoices';
  static readonly COLLECTION_ORDERBY: OrderByOption = { fieldName: 'issuedAt', direction: 'desc' };

  constructor(private http: HttpClient,
              protected afs: AngularFirestore) {
    super(afs, InvoicesService.COLLECTION_NAME, InvoicesService.COLLECTION_ORDERBY);
  }

  createInvoicePDF(payload: InvoiceData): Observable<InvoiceData> {
    console.log('*** about to invoke https-function ...');
    // const url = `https://us-central1-jovisco-invoicing.cloudfunctions.net/invoicing/invoice-pdf/${payload.id}`;
    const url = `${environment.cloudFunctionsURL}/invoicing/invoice-pdf/${payload.id}`;
    console.log(`URL for cloud function is: ${url}`);
    return this.http
      .post<InvoiceData>(url, payload)
      .pipe(
        tap(response => console.log('RESPONSE FROM CREATE PDF: ', response)),
        catchError((error: any) =>  throwError(error))
      );
  }

  sendInvoiceEmail(payload: InvoiceData): Observable<InvoiceData> {
    // const url = `https://us-central1-jovisco-invoicing.cloudfunctions.net/invoicing/invoice-email/${payload.id}`;
    const url = `${environment.cloudFunctionsURL}/invoicing/invoice-email/${payload.id}`;
    return this.http
      .post<InvoiceData>(url, payload)
      .pipe(
        tap(response => console.log('RESPONSE FROM SEND EMAIL: ', response)),
        catchError((error: any) => throwError(error))
      );
  }
}
