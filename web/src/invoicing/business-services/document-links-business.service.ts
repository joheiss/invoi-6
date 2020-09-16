import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs/index';
import * as fromStore from '../store';
import {Action, select, Store} from '@ngrx/store';
import {AbstractBusinessService} from './abstract-business.service';
import {DocumentLink, DocumentLinkData} from 'jovisco-domain';

@Injectable()
export class DocumentLinksBusinessService extends AbstractBusinessService<DocumentLinkData> {

  constructor(protected store: Store<fromStore.InvoicingState>) {
    super(store);
  }

  getDocumentLinks(objectType: string): Observable<DocumentLinkData[]> {
    const collectionName = objectType;
    if (!collectionName) return of([]);

    switch (collectionName) {
      case 'contracts':
        return this.getDocumentLinksForContract();
      case 'invoices':
        return this.getDocumentLinksForInvoice();
      case 'receivers':
        return this.getDocumentLinksForReceiver();
      default:
        return throwError(new Error('Unknown owner'));
    }
  }

  getDocumentLinksForContract(): Observable<DocumentLinkData[]> {
    return this.store.pipe(select(fromStore.selectDocumentLinksForContract));
  }

  getDocumentLinksForInvoice(): Observable<DocumentLinkData[]> {
    return this.store.pipe(select(fromStore.selectDocumentLinksForInvoice));
  }

  getDocumentLinksForReceiver(): Observable<DocumentLinkData[]> {
    return this.store.pipe(select(fromStore.selectDocumentLinksForReceiver));
  }

  protected buildChangeSuccessEvent(data: any): Action {
    return new fromStore.ChangeDocumentLinkSuccess(data);
  }

  protected buildCreateCommand(data: any): Action {
    return new fromStore.CreateDocumentLink(data);
  }

  protected buildDeleteCommand(data: any): Action {
    return new fromStore.DeleteDocumentLink(data);
  }

  protected buildNewEvent(data: any): Action {
    return new fromStore.NewDocumentLinkSuccess(data);
  }

  protected buildUpdateCommand(data: any): Action {
    return new fromStore.UpdateDocumentLink(data);
  }

  protected getTemplate(): any {
    return DocumentLink.defaultValues();
  }

}
