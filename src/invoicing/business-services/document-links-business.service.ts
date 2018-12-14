import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs/index';
import * as fromStore from '../store/index';
import {Action, select, Store} from '@ngrx/store';
import {DocumentLink, DocumentLinkType} from '../models/document-link';
import {AbstractBusinessService} from './abstract-business.service';

@Injectable()
export class DocumentLinksBusinessService extends AbstractBusinessService<DocumentLink> {

  private static template: DocumentLink = {
    id: undefined,
    path: undefined,
    name: undefined,
    type: DocumentLinkType.Other,
    owner: undefined,
    attachToEmail: false
  };

  constructor(protected store: Store<fromStore.InvoicingState>) {
    super(store);
  }

  getDocumentLinks(owner: string): Observable<DocumentLink[]> {
    const collectionName = this.getCollectionNameFromOwner(owner);
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

  getDocumentLinksForContract(): Observable<DocumentLink[]> {
    return this.store.pipe(select(fromStore.selectDocumentLinksForContract));
  }

  getDocumentLinksForInvoice(): Observable<DocumentLink[]> {
    return this.store.pipe(select(fromStore.selectDocumentLinksForInvoice));
  }

  getDocumentLinksForReceiver(): Observable<DocumentLink[]> {
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
    return DocumentLinksBusinessService.template;
  }

  private getCollectionNameFromOwner(owner: string): string {
    const ownerSplit = owner.split('/');
    if (ownerSplit.length !== 2) {
      return undefined;
    }
    return ownerSplit[0];
  }
}
