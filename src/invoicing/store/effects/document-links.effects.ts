import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {Store} from '@ngrx/store';
import * as documentLinksActions from '../actions/document-links.actions';
import * as fromServices from '../../services';
import * as fromRoot from '../../../app/store';

@Injectable()
export class DocumentLinksEffects {

  constructor(private actions$: Actions,
              private documentLinksService: fromServices.DocumentLinksService,
              private store: Store<fromRoot.AppState>) {
  }

  // FIRESTORE
  @Effect()
  queryDocumentLinks$ = this.actions$
    .ofType(documentLinksActions.QUERY_DOCUMENT_LINKS)
    .pipe(
      switchMap(action => this.documentLinksService.queryAll()),
      mergeMap(actions => actions),
      map(action => {
        const type = `[Invoicing] Document Link ${action.type}`;
        const payload = { ...action.payload.doc.data(), id: action.payload.doc.id };
        console.log('Query DocumentLinks: ', type, payload);
        return {type, payload};
      })
    );

  @Effect()
  queryDocumentLinksForObject$ = this.actions$
    .ofType(documentLinksActions.QUERY_DOCUMENT_LINKS_FOR_OBJECT)
    .pipe(
      map((action: documentLinksActions.QueryDocumentLinksForObject) => action),
      switchMap(action => this.documentLinksService.queryForObject(action.payload)),
      mergeMap(actions => actions),
      map(action => {
        const type = `[Invoicing] Document Link ${action.type}`;
        const payload = { ...action.payload.doc.data(), id: action.payload.doc.id };
        console.log('Query DocumentLinks: ', type, payload);
        return {type, payload};
      })
    );

  @Effect()
  updateDocumentLink$ = this.actions$
    .ofType(documentLinksActions.UPDATE_DOCUMENT_LINK)
    .pipe(
      map((action: documentLinksActions.UpdateDocumentLink) => action.payload),
      switchMap(documentLink => this.documentLinksService.update(documentLink)
        .pipe(
          map(documentLink => new documentLinksActions.UpdateDocumentLinkSuccess(documentLink)),
          catchError(error => {
            console.error(error);
            return of(new documentLinksActions.UpdateDocumentLinkFail(error));
          })
        ))
    );

// --- CREATING
  @Effect()
  createDocumentLink$ = this.actions$
    .ofType(documentLinksActions.CREATE_DOCUMENT_LINK)
    .pipe(
      map((action: documentLinksActions.CreateDocumentLink) => action.payload),
      switchMap(documentLink => this.documentLinksService.create(documentLink)
        .pipe(
          map(documentLink => new documentLinksActions.CreateDocumentLinkSuccess(documentLink)),
          catchError(error => of(new documentLinksActions.CreateDocumentLinkFail(error)))
        ))
    );

// DELETING
  @Effect()
  deleteDocumentLink$ = this.actions$.ofType(documentLinksActions.DELETE_DOCUMENT_LINK)
    .pipe(
      map((action: documentLinksActions.DeleteDocumentLink) => action.payload),
      switchMap(documentLink => this.documentLinksService.delete(documentLink)
        .pipe(
          map(() => new documentLinksActions.DeleteDocumentLinkSuccess(documentLink)),
          catchError(error => of(new documentLinksActions.DeleteDocumentLinkFail(error)))
        ))
    );

}
