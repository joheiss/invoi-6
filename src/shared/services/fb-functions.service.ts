import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UserData} from '../../auth/models/user';
import {InvoiceData} from '../../invoicing/models/invoice.model';
import {catchError, tap} from 'rxjs/operators';
import {SharedModule} from '../shared.module';

@Injectable({
  providedIn: SharedModule
})
export class FbFunctionsService {

  constructor(private http: HttpClient) {
  }

  /* --- invoices --- */
  createInvoicePDF(payload: InvoiceData): Observable<InvoiceData> {
    const url = `${environment.cloudFunctionsURL}/invoicing/invoice-pdf/${payload.id}`;
    return this.http
      .post<InvoiceData>(url, payload)
      .pipe(
        tap(response => console.log('RESPONSE FROM CREATE PDF: ', response)),
        catchError((error: any) => throwError(error))
      );
  }

  sendInvoiceEmail(payload: InvoiceData): Observable<InvoiceData> {
    const url = `${environment.cloudFunctionsURL}/invoicing/invoice-email/${payload.id}`;
    return this.http
      .post<InvoiceData>(url, payload)
      .pipe(
        tap(response => console.log('RESPONSE FROM SEND EMAIL: ', response)),
        catchError((error: any) => throwError(error))
      );
  }

  /* --- users --- */
  changePassword(payload: { uid: string, password: string }): Observable<any> {
    const url = `${environment.cloudFunctionsURL}/users/${payload.uid}`;
    return this.http.post<any>(url, payload);
  }

  createOneUser(payload: { user: UserData, password: string }): Observable<UserData> {
    const url = `${environment.cloudFunctionsURL}/users/new`;
    return this.http.post<any>(url, payload);
  }

  updateOneUser(payload: { user: UserData, password: string }): Observable<UserData> {
    const url = `${environment.cloudFunctionsURL}/users/${payload.user.uid}`;
    return this.http.post<any>(url, payload);
  }
}
