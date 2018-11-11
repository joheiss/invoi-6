import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/reducers';
import {DocumentLinksService} from '../../services';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold, hot} from 'jasmine-marbles';
import {
  CreateDocumentLink,
  CreateDocumentLinkFail,
  CreateDocumentLinkSuccess,
  DeleteDocumentLink,
  DeleteDocumentLinkFail,
  DeleteDocumentLinkSuccess,
  QueryDocumentLinks,
  QueryDocumentLinksForObject,
  UpdateDocumentLink,
  UpdateDocumentLinkFail,
  UpdateDocumentLinkSuccess
} from '../actions';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {DocumentLinksEffects} from './document-links.effects';
import {mockAllDocumentLinks, mockSingleDocumentLink} from '../../../test/factories/mock-document-links.factory';
import {mockSingleInvoice} from '../../../test/factories/mock-invoices.factory';

describe('Document Links Effects', () => {

  let effects: DocumentLinksEffects;
  let actions: Observable<any>;
  let store: Store<AppState>;
  let documentLinksService: DocumentLinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DocumentLinksEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => of(mockAuth()[0]))
          }
        },
        {
          provide: DocumentLinksService,
          useValue: {
            queryAll: jest.fn(() => of(mockAllDocumentLinks().slice(0, 3))),
            queryForObject: jest.fn(() => of(mockAllDocumentLinks().filter(dl => dl.owner === 'invoices/5901'))),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            getMessage: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.get(DocumentLinksEffects);
    store = TestBed.get(Store);
    documentLinksService = TestBed.get(DocumentLinksService);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should be created', async () => {
    return expect(effects).toBeTruthy();
  });

  describe('queryDocumentLinks$', () => {
    it('should return an array of Document Links Added actions', async () => {
      const action = new QueryDocumentLinks();
      actions = hot('-a', {a: action});
      const outcome = mockAllDocumentLinks().slice(0, 3).map(dl => {
        const type = 'Added';
        const payload = {doc: {id: dl.id, data: jest.fn(() => dl)}};
        return {type, payload};
      });
      const mapped = mockAllDocumentLinks().slice(0, 3).map(dl => {
        const type = '[Invoicing] Document Link Added';
        return {type, payload: dl};
      });
      const expected = cold('-(cde)', {c: mapped[0], d: mapped[1], e: mapped[2]});
      documentLinksService.queryAll = jest.fn(() => of(outcome));
      return expect(effects.queryDocumentLinks$).toBeObservable(expected);
    });
  });

  describe('queryDocumentLinksForObject$', () => {
    it('should return an array of Document Links Added actions', async () => {
      const invoice = mockSingleInvoice();
      const action = new QueryDocumentLinksForObject({objectType: invoice.objectType, id: invoice.id});
      actions = hot('-a', {a: action});
      const outcome = mockAllDocumentLinks()
        .filter(dl => dl.owner === `${invoice.objectType}/${invoice.id}`)
        .map(dl => {
          const type = 'Added';
          const payload = {doc: {id: dl.id, data: jest.fn(() => dl)}};
          return {type, payload};
        })
        .slice(0, 1);
      const mapped = mockAllDocumentLinks()
        .filter(dl => dl.owner === `${invoice.objectType}/${invoice.id}`)
        .map(dl => {
          const type = '[Invoicing] Document Link Added';
          return {type, payload: dl};
        })
        .slice(0, 1);
      const expected = cold('-(c)', {c: mapped[0]});
      documentLinksService.queryForObject = jest.fn(() => of(outcome));
      return expect(effects.queryDocumentLinksForObject$).toBeObservable(expected);
    });
  });

  describe('updateDocumentLink$', () => {
    it('should return an UpdateDocumentLinkSuccess action ', async () => {
      const docLink = mockSingleDocumentLink();
      const action = new UpdateDocumentLink(docLink);
      actions = hot('-a', {a: action});
      const outcome = new UpdateDocumentLinkSuccess(docLink);
      const expected = cold('--c', {c: outcome});
      documentLinksService.update = jest.fn(() => cold('-b|', {b: docLink}));
      return expect(effects.updateDocumentLink$).toBeObservable(expected);
    });

    it('should return an UpdateDocumentLinkFail action ', async () => {
      const docLink = mockSingleDocumentLink();
      const action = new UpdateDocumentLink(docLink);
      actions = hot('-a', {a: action});
      const error = new Error('Update failed');
      const outcome = new UpdateDocumentLinkFail(error);
      const expected = cold('--c', {c: outcome});
      documentLinksService.update = jest.fn(() => cold('-#|', {}, error));
      return expect(effects.updateDocumentLink$).toBeObservable(expected);
    });
  });

  describe('createDocumentLink$', () => {
    it('should return an CreateDocumentLinkSuccess action ', async () => {
      const docLink = mockSingleDocumentLink();
      const action = new CreateDocumentLink(docLink);
      actions = hot('-a', {a: action});
      const outcome = new CreateDocumentLinkSuccess(docLink);
      const expected = cold('--c', {c: outcome});
      documentLinksService.create = jest.fn(() => cold('-b|', {b: docLink}));
      return expect(effects.createDocumentLink$).toBeObservable(expected);
    });

    it('should return an CreateDocumentLinkFail action ', async () => {
      const docLink = mockSingleDocumentLink();
      const action = new CreateDocumentLink(docLink);
      actions = hot('-a', {a: action});
      const error = new Error('Create failed');
      const outcome = new CreateDocumentLinkFail(error);
      const expected = cold('--c', {c: outcome});
      documentLinksService.create = jest.fn(() => cold('-#|', {}, error));
      return expect(effects.createDocumentLink$).toBeObservable(expected);
    });
  });

  describe('deleteDocumentLink$', () => {
    it('should return an DeleteDocumentLinkSuccess action ', async () => {
      const docLink = mockSingleDocumentLink();
      const action = new DeleteDocumentLink(docLink);
      actions = hot('-a', {a: action});
      const outcome = new DeleteDocumentLinkSuccess(docLink);
      const expected = cold('--c', {c: outcome});
      documentLinksService.delete = jest.fn(() => cold('-b|', {b: docLink}));
      return expect(effects.deleteDocumentLink$).toBeObservable(expected);
    });

    it('should return an DeleteDocumentLinkFail action ', async () => {
      const docLink = mockSingleDocumentLink();
      const action = new DeleteDocumentLink(docLink);
      actions = hot('-a', {a: action});
      const error = new Error('Delete failed');
      const outcome = new DeleteDocumentLinkFail(error);
      const expected = cold('--c', {c: outcome});
      documentLinksService.delete = jest.fn(() => cold('-#|', {}, error));
      return expect(effects.deleteDocumentLink$).toBeObservable(expected);
    });
  });
});
