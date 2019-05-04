import {TestBed} from '@angular/core/testing';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {DocumentLinksService} from './document-links.service';
import {mockSingleDocumentLink} from '../../test/factories/mock-document-links.factory';
import {mockSingleInvoice} from '../../test/factories/mock-invoices.factory';
import {DocumentLinkData, InvoiceData} from 'jovisco-domain';

describe('Document Links Service', () => {
  let service: DocumentLinksService;
  let persistence: FbStoreService;
  let invoice: InvoiceData;
  let docLink: DocumentLinkData;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FbStoreService,
          useValue: {
            assignCollection: jest.fn(),
            queryAllDocumentLinksForObject: jest.fn(),
            createDocumentLink: jest.fn()
          }
        },
        DocumentLinksService
      ]
    });

    persistence = TestBed.get(FbStoreService);
    service = TestBed.get(DocumentLinksService);
  });

  beforeEach(() => {
    invoice = mockSingleInvoice();
    docLink = mockSingleDocumentLink();
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });

  it('should invoke query all document links for objects', () => {
    const spy = jest.spyOn(persistence, 'queryAllDocumentLinksForObject');
    service.queryForObject(invoice);
    expect(spy).toHaveBeenCalledWith(invoice);
  });

  it('should invoke create document link', () => {
    const spy = jest.spyOn(persistence, 'createDocumentLink');
    service.create(docLink);
    expect(spy).toHaveBeenCalledWith(docLink);
  });
});
