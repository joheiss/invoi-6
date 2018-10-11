import {Store} from '@ngrx/store';
import {generateContract, generateDocumentLink} from '../../test/test-generators';
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
import {DocumentLink} from '../models/document-link';

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
            pipe: jest.fn()
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
    docLink = generateDocumentLink('contracts/4901');
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
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

  it('should return all document links for a given document', async () => {
    const contract = generateContract();
    const expected = cold('-b|', { b: generateDocumentLink('contracts/4901') });
    const spy = jest.spyOn(service, 'getDocumentLinksForContract');
    store.pipe = jest.fn(() => expected);
    await expect(service.getDocumentLinks(contract.ownerKey)).toBeObservable(expected);
    return expect(spy).toHaveBeenCalled();
  });

  it('should dispatch NewDocumentLinkSuccess event when new is processed', async () => {
    const docLink = Object.assign({}, DocumentLinksBusinessService['template']);
    const event = new NewDocumentLinkSuccess(docLink);
    const spy = jest.spyOn(store, 'dispatch');
    service.new();
    return expect(spy).toHaveBeenCalledWith(event);
  });

  it('should invoke store selector if query is processed', async () => {
    const spy = jest.spyOn(store, 'pipe');
    service.query();
    return expect(spy).toHaveBeenCalled();
  });

  it('should dispatch UpdateDocumentLink action when update is processed', async () => {
    const action = new UpdateDocumentLink(docLink);
    const spy = jest.spyOn(store, 'dispatch');
    service.update(docLink);
    return expect(spy).toHaveBeenCalledWith(action);
  });
});
