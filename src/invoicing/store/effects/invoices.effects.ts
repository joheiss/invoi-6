import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import * as fromServices from '../../services';
import * as invoiceActions from '../actions/invoices.actions';
import {catchError, filter, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import * as fromRoot from '../../../app/store';
import {Store} from '@ngrx/store';
import {selectAuth} from '../../../auth/store/selectors';
import {UserData} from '../../../auth/models/user';

@Injectable()
export class InvoicesEffects {
  auth: UserData;

  constructor(private actions$: Actions,
              private invoicesService: fromServices.InvoicesService,
              private store: Store<fromRoot.AppState>) {
  }

  // FIRESTORE
  @Effect()
  queryInvoices$ = this.actions$
    .ofType(invoiceActions.QUERY_INVOICES)
    .pipe(
      map((action: invoiceActions.QueryInvoices) => action.payload),
      switchMap(() => this.store.select(selectAuth)
        .pipe(
          filter(auth => !!auth),
          tap(auth => this.auth = auth),
          switchMap(payload => this.invoicesService.queryAll()),
          mergeMap(actions => actions),
          filter(action => action.payload.doc.data().organization === this.auth.organization),
          map(action => {
            const type = `[Invoicing] Invoice ${action.type}`;
            const payload = {...action.payload.doc.data(), id: action.payload.doc.id };
            return { type, payload };
          })
        ))
    );

  @Effect()
  updateInvoice$ = this.actions$
    .ofType(invoiceActions.UPDATE_INVOICE)
    .pipe(
      tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
      map((action: invoiceActions.UpdateInvoice) => action.payload),
      switchMap(invoice => this.invoicesService.update(invoice)
        .pipe(
          map(invoice => new invoiceActions.UpdateInvoiceSuccess(invoice)),
          catchError(error => {
            console.error(error);
            return of(new invoiceActions.UpdateInvoiceFail(error));
          })
        ))
    );

  @Effect()
  updateInvoiceSuccess$ = this.actions$
    .ofType(invoiceActions.UPDATE_INVOICE_SUCCESS)
    .pipe(
      map((action: invoiceActions.UpdateInvoiceSuccess) => action.payload),
      switchMap(invoice => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.invoicesService.getMessage('invoice-update-success', [invoice.id])
        }),
        new fromRoot.Go({path: ['/invoicing/invoices']})
      ])
    );

  @Effect()
  updateInvoiceFail$ = this.actions$
    .ofType(invoiceActions.UPDATE_INVOICE_FAIL)
    .pipe(
      map((action: invoiceActions.UpdateInvoiceFail) => action.payload),
      switchMap(error => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.invoicesService.getMessage('invoice-update-fail', [error.message])
        })
      ])
    );

  // --- CREATING
  @Effect()
  createInvoice$ = this.actions$
    .ofType(invoiceActions.CREATE_INVOICE)
    .pipe(
      tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
      map((action: invoiceActions.CreateInvoice) => action.payload),
      switchMap(invoice => this.invoicesService.create(invoice)
        .pipe(
          map(invoice => new invoiceActions.CreateInvoiceSuccess(invoice)),
          catchError(error => of(new invoiceActions.CreateInvoiceFail(error)))
        ))
    );

  @Effect()
  createInvoiceSuccess$ = this.actions$
    .ofType(invoiceActions.CREATE_INVOICE_SUCCESS)
    .pipe(
      map((action: invoiceActions.CreateInvoiceSuccess) => action.payload),
     switchMap(invoice => [
       new fromRoot.StopSpinning(),
       new fromRoot.Go({path: ['/invoicing/invoices', invoice.id]})
     ])
    );

  @Effect()
  createInvoiceFail$ = this.actions$
    .ofType(invoiceActions.CREATE_INVOICE_FAIL)
    .pipe(
      map((action: invoiceActions.CreateInvoiceFail) => action.payload),
      switchMap(error => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.invoicesService.getMessage('invoice-create-fail', [error.message])
        })
      ])
    );

  // DELETING
  @Effect()
  deleteInvoice$ = this.actions$
    .ofType(invoiceActions.DELETE_INVOICE)
    .pipe(
      map((action: invoiceActions.DeleteInvoice) => action.payload),
      switchMap(invoice => this.invoicesService.delete(invoice)
        .pipe(
          map(invoice => new invoiceActions.DeleteInvoiceSuccess(invoice)),
          catchError(error => of(new invoiceActions.DeleteInvoiceFail(error)))
        ))
    );

  @Effect()
  deleteInvoiceSuccess$ = this.actions$
    .ofType(invoiceActions.DELETE_INVOICE_SUCCESS)
    .pipe(
      map((action: invoiceActions.DeleteInvoiceSuccess) => action.payload),
      switchMap(invoice => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.invoicesService.getMessage('invoice-delete-success', [invoice.id])
        }),
        new fromRoot.Go({path: ['/invoicing/invoices']})
      ])
    );

  @Effect()
  deleteInvoiceFail$ = this.actions$
    .ofType(invoiceActions.DELETE_INVOICE_FAIL)
    .pipe(
      map((action: invoiceActions.DeleteInvoiceFail) => action.payload),
      switchMap(error => [
        new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({
          message: this.invoicesService.getMessage('invoice-delete-fail', [error.message])
        })
      ])
    );

  // --- COPYING
  @Effect()
  copyInvoiceSuccess$ = this.actions$
    .ofType(invoiceActions.COPY_INVOICE_SUCCESS)
    .pipe(
      map((action: invoiceActions.CopyInvoiceSuccess) => action.payload),
      map(invoice => new fromRoot.Go({path: ['/invoicing/invoices', 'copy']}))
    );

  // --- NEW
  @Effect()
  newInvoiceSuccess$ = this.actions$
    .ofType(invoiceActions.NEW_INVOICE_SUCCESS)
    .pipe(
      map((action: invoiceActions.NewInvoiceSuccess) => action.payload),
      map(invoice => new fromRoot.Go({path: ['/invoicing/invoices', 'new']}))
    );

  // --- NEW QUICK
  @Effect()
  newQuickInvoiceSuccess$ = this.actions$
    .ofType(invoiceActions.NEW_QUICK_INVOICE_SUCCESS)
    .pipe(
      map((action: invoiceActions.NewQuickInvoiceSuccess) => action.payload),
      map(invoice => new fromRoot.Go({path: ['/invoicing/invoices', 'quick']}))
    );

  // --- CREATING PDF
  @Effect()
  createInvoicePdf$ = this.actions$
    .ofType(invoiceActions.CREATE_INVOICE_PDF)
    .pipe(
      tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
      map((action: invoiceActions.CreateInvoicePdf) => action.payload),
      switchMap(invoice => this.invoicesService.createInvoicePDF(invoice)
        .pipe(
          tap(() => this.store.dispatch(new fromRoot.StopSpinning())),
          map(invoice => new invoiceActions.CreateInvoicePdfSuccess(invoice)),
          catchError(error => of(new invoiceActions.CreateInvoicePdfFail(error)))
        ))
    );

  @Effect()
  createInvoicePdfFail$ = this.actions$
    .ofType(invoiceActions.CREATE_INVOICE_PDF_FAIL)
    .pipe(
      tap(error => console.error(error)),
      map((action: invoiceActions.CreateInvoicePdfFail) => action.payload),
      switchMap(error => [
        // new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({ message: this.invoicesService.getMessage('invoice-pdf-failed') })
      ])
    );

  @Effect()
  createInvoicePdfSuccess$ = this.actions$
    .ofType(invoiceActions.CREATE_INVOICE_PDF_SUCCESS)
    .pipe(
      tap(() => console.log('*** CreateInvoicePdfSuccess')),
      map((action: invoiceActions.CreateInvoicePdfSuccess) => action.payload),
      switchMap(invoice => [
        // new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({ message: this.invoicesService.getMessage('invoice-pdf-created') })
      ])
    );

  // --- SENDING EMAIL
  @Effect()
  sendInvoiceEmail$ = this.actions$
    .ofType(invoiceActions.SEND_INVOICE_EMAIL)
    .pipe(
      tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
      map((action: invoiceActions.SendInvoiceEmail) => action.payload),
      switchMap(invoice => this.invoicesService.sendInvoiceEmail(invoice)
        .pipe(
          tap(() => this.store.dispatch(new fromRoot.StopSpinning())),
          map(invoice => new invoiceActions.SendInvoiceEmailSuccess(invoice)),
          catchError(error => of(new invoiceActions.SendInvoiceEmailFail(error)))
        ))
    );

  @Effect()
  sendInvoiceEmailFail$ = this.actions$
    .ofType(invoiceActions.SEND_INVOICE_EMAIL_FAIL)
    .pipe(
      tap(error => console.error(error)),
      map((action: invoiceActions.SendInvoiceEmailFail) => action.payload),
      switchMap(error => [
        // new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({ message: this.invoicesService.getMessage('invoice-email-fail') })
      ])
    );

  @Effect()
  sendInvoiceEmailSuccess$ = this.actions$
    .ofType(invoiceActions.SEND_INVOICE_EMAIL_SUCCESS)
    .pipe(
      tap(() => console.log('*** SendInvoiceEmailSuccess')),
      map((action: invoiceActions.SendInvoiceEmailSuccess) => action.payload),
      switchMap(invoice => [
        // new fromRoot.StopSpinning(),
        new fromRoot.OpenSnackBar({ message: this.invoicesService.getMessage('invoice-email-success') })
      ])
    );
}
