import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/index';
import * as documentLinksActions from '../actions/document-links.actions';
import * as fromServices from '../../services';

@Injectable()
export class DocumentLinksEffects {

  constructor(private actions$: Actions,
              private documentLinksService: fromServices.DocumentLinksService) {
  }

  // FIRESTORE
  @Effect()
  queryDocumentLinks$ = this.actions$.pipe(
    ofType(documentLinksActions.QUERY_DOCUMENT_LINKS),
    switchMap(action => this.documentLinksService.queryAll()),
    mergeMap(actions => actions),
    map(action => {
      const type = `[Invoicing] Document Link ${action.type}`;
      const payload = {...action.payload.doc.data(), id: action.payload.doc.id};
      // console.log('Query DocumentLinks: ', type, payload);
      return {type, payload};
    })
  );

  @Effect()
  queryDocumentLinksForObject$ = this.actions$.pipe(
    ofType(documentLinksActions.QUERY_DOCUMENT_LINKS_FOR_OBJECT),
    map((action: documentLinksActions.QueryDocumentLinksForObject) => action),
    switchMap(action => this.documentLinksService.queryForObject(action.payload)),
    mergeMap(actions => actions),
    map(action => {
      const type = `[Invoicing] Document Link ${action.type}`;
      const payload = {...action.payload.doc.data(), id: action.payload.doc.id};
      // console.log('Query DocumentLinks: ', type, payload);
      return {type, payload};
    })
  );

  @Effect()
  updateDocumentLink$ = this.actions$.pipe(
    ofType(documentLinksActions.UPDATE_DOCUMENT_LINK),
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
  createDocumentLink$ = this.actions$.pipe(
    ofType(documentLinksActions.CREATE_DOCUMENT_LINK),
    map((action: documentLinksActions.CreateDocumentLink) => action.payload),
    switchMap(documentLink => this.documentLinksService.create(documentLink)
      .pipe(
        map(documentLink => new documentLinksActions.CreateDocumentLinkSuccess(documentLink)),
        catchError(error => of(new documentLinksActions.CreateDocumentLinkFail(error)))
      ))
  );

// DELETING
  @Effect()
  deleteDocumentLink$ = this.actions$.pipe(
    ofType(documentLinksActions.DELETE_DOCUMENT_LINK),
    map((action: documentLinksActions.DeleteDocumentLink) => action.payload),
    switchMap(documentLink => this.documentLinksService.delete(documentLink)
      .pipe(
        map(() => new documentLinksActions.DeleteDocumentLinkSuccess(documentLink)),
        catchError(error => of(new documentLinksActions.DeleteDocumentLinkFail(error)))
      ))
  );

}
