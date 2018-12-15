import {Store} from '@ngrx/store';
import {TestBed} from '@angular/core/testing';
import {cold} from 'jasmine-marbles';
import {InvoicingState} from '../store/reducers';
import {
  ChangeDocumentLinkSuccess,
  CreateDocumentLink,
  DeleteDocumentLink,
  NewDocumentLinkSuccess,
  UpdateDocumentLink
} from '../store/actions';
import {DocumentLinksBusinessService} from './document-links-business.service';
import {DocumentLink, DocumentLinkType} from '../models/document-link';
import {mockAllDocumentLinks, mockSingleDocumentLink} from '../../test/factories/mock-document-links.factory';
import {mockAllInvoices} from '../../test/factories/mock-invoices.factory';

let store: Store<InvoicingState>;
let service: DocumentLinksBusinessService;
let docLink: DocumentLink;

describe('Document Links Business Service', () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => cold('-b|', {b: true}))
          }
        },

        DocumentLinksBusinessService
      ]
    });
    store = TestBed.get(Store);
    service = TestBed.get(DocumentLinksBusinessService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  beforeEach(() => {
    docLink = mockSingleDocumentLink();
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });

  it('should return a meaningful template for document links', () => {
    const template = DocumentLinksBusinessService['template'];
    expect(template.type).toBe(DocumentLinkType.Other);
    expect(template.attachToEmail).toBeFalsy();
  });

  it('should dispatch ChangeDocumentLinkSuccess event when change is processed', async () => {
    const event = new ChangeDocumentLinkSuccess(docLink);
    const spy = jest.spyOn(store, 'dispatch');
    service.change(docLink);
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should dispatch CreateDocumentLink action when create is processed', async () => {
    const action = new CreateDocumentLink(docLink);
    const spy = jest.spyOn(store, 'dispatch');
    service.create(docLink);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should dispatch DeleteDocumentLink action when delete is processed', async () => {
    const action = new DeleteDocumentLink(docLink);
    const spy = jest.spyOn(store, 'dispatch');
    service.delete(docLink);
    return expect(spy).toHaveBeenCalledWith(action);
  });

  it('should return all document links for a given document', () => {
    let spy = jest.spyOn(service, 'getDocumentLinksForReceiver');
    service.getDocumentLinks('receivers/1901');
    expect(spy).toHaveBeenCalled();
    spy = jest.spyOn(service, 'getDocumentLinksForContract');
    service.getDocumentLinks('contracts/4901');
    expect(spy).toHaveBeenCalled();
    spy = jest.spyOn(service, 'getDocumentLinksForInvoice');
    service.getDocumentLinks('invoices/5901');
    expect(spy).toHaveBeenCalled();
    const expected = cold('#)', {}, new Error('Unknown owner'));
    expect(service.getDocumentLinks('errors/9999')).toBeObservable(expected);
  });

  it('should dispatch NewDocumentLinkSuccess event when new is processed', async () => {
    const docLink = Object.assign({}, DocumentLinksBusinessService['template']);
    const event = new NewDocumentLinkSuccess(docLink);
    const spy = jest.spyOn(store, 'dispatch');
    service.new(docLink);
    return expect(spy).toHaveBeenCalledWith(event);
  });

  // it('should invoke store selector if query is processed', async () => {
  //   const spy = jest.spyOn(store, 'pipe');
  //   service.query();
  //   return expect(spy).toHaveBeenCalled();
  // });

  it('should dispatch UpdateDocumentLink action when update is processed', async () => {
    const action = new UpdateDocumentLink(docLink);
    const spy = jest.spyOn(store, 'dispatch');
    service.update(docLink);
    return expect(spy).toHaveBeenCalledWith(action);
  });
});
