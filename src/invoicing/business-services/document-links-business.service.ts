import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs/index';
import * as fromStore from '../store/index';
import {Store} from '@ngrx/store';
import {DocumentLink, DocumentLinkType} from '../models/document-link';

@Injectable()
export class DocumentLinksBusinessService {

  private static template: DocumentLink = {
    id: undefined,
    path: undefined,
    name: undefined,
    type: DocumentLinkType.Other,
    owner: undefined,
    attachToEmail: false
  };

  constructor(private store: Store<fromStore.InvoicingState>) { }

  change(documentLink: DocumentLink) {
    this.store.dispatch(new fromStore.ChangeDocumentLinkSuccess(documentLink));
  }

  create(documentLink: DocumentLink) {
    this.store.dispatch(new fromStore.CreateDocumentLink(documentLink));
  }

  delete(documentLink: DocumentLink) {
    this.store.dispatch(new fromStore.DeleteDocumentLink(documentLink));
  }

  getDocumentLinks(owner: string): Observable<DocumentLink[]> {
    const ownerSplit = owner.split('/');
    if (ownerSplit.length !== 2) {
      return of([]);
    }
    const collectionName = ownerSplit[0];
    switch (collectionName) {
      case 'contracts': {
        return this.getDocumentLinksForContract();
      }
      case 'invoices': {
        return this.getDocumentLinksForInvoice();
      }
      case 'receivers': {
        return this.getDocumentLinksForReceiver();
      }
      default: {
        throw new Error('Unknown owner');
      }
    }
  }

  getDocumentLinksForContract(): Observable<DocumentLink[]> {
    return this.store.select(fromStore.selectDocumentLinksForContract);
  }

  getDocumentLinksForInvoice(): Observable<DocumentLink[]> {
    return this.store.select(fromStore.selectDocumentLinksForInvoice);
  }

  getDocumentLinksForReceiver(): Observable<DocumentLink[]> {
    return this.store.select(fromStore.selectDocumentLinksForReceiver);
  }

  new() {
    const data = Object.assign({}, DocumentLinksBusinessService.template);
    this.store.dispatch(new fromStore.NewDocumentLinkSuccess(data));
  }

  query(): Observable<DocumentLink[]> {
    return this.store.select(fromStore.selectAllDocumentLinks);
  }

  update(documentLink: DocumentLink) {
    this.store.dispatch(new fromStore.UpdateDocumentLink(documentLink));
  }
}
