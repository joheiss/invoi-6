import {TestBed} from '@angular/core/testing';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {mockSingleDocumentLink} from '../../test/factories/mock-document-links.factory';
import {ObjectsApiService} from './objects-api.service';
import {ContractsService} from './contracts.service';
import {mockSingleContract} from '../../test/factories/mock-contracts.factory';
import {OrderByOption} from '../../shared/models/order-by-option';
import {INVOICING_MSGS} from '../invoicing-error-messages';
import {ContractData, DocumentLinkData, Messages} from 'jovisco-domain';

describe('Objects Api Service', () => {
  let service: ObjectsApiService<ContractData>;
  let persistence: FbStoreService;
  let contract: ContractData;
  let docLink: DocumentLinkData;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FbStoreService,
          useValue: {
            assignCollection: jest.fn(),
            createDocument: jest.fn(),
            createDocumentLink: jest.fn(),
            deleteDocument: jest.fn(),
            documentExists: jest.fn(),
            queryAll: jest.fn(),
            queryAllDocumentLinksForObject: jest.fn(),
            updateDocument: jest.fn()
          }
        },
        ContractsService
      ]
    });

    persistence = TestBed.inject(FbStoreService);
    service = TestBed.inject(ContractsService);
  });

  beforeEach(() => {
    contract = mockSingleContract();
    docLink = mockSingleDocumentLink();
    service.col = 'contracts';
    service.messages = new Messages(INVOICING_MSGS);
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
    const colName = 'contracts';
    const colOrderBy = {fieldName: 'issuedAt', direction: 'desc'} as OrderByOption;
    const spy = jest.spyOn(persistence, 'assignCollection');
    expect(spy).toHaveBeenCalledWith(colName, colOrderBy);
  });

  it('should invoke queryAll of fire store service, when queryAll is processed', async () => {
    service.queryAll();
    const spy = jest.spyOn(persistence, 'queryAll');
    expect(spy).toHaveBeenCalledWith('contracts');
  });

  it('should invoke documentExists and createDocument of fire store service if create is processed', async () => {
    const mock = {...contract, id: (+contract.id + 2).toString()};
    persistence.documentExists = jest.fn(() => Promise.resolve(false));
    service.create(mock);
    let spy = jest.spyOn(persistence, 'documentExists');
    await expect(spy).toHaveBeenCalledWith('contracts', mock);
    spy = jest.spyOn(persistence, 'createDocument');
    expect(spy).toHaveBeenCalledWith('contracts', mock);
  });

  it('should return an error if document to be created already exists', done => {
    const mock = contract;
    persistence.documentExists = jest.fn(() => Promise.resolve(true));
    service.create(mock).subscribe(
      _ => {
      },
      err => {
        expect(err).toEqual(new Error(`Document with id ${mock.id} already exists. Check number ranges.`));
        done();
      },
      () => {
      });
  });

  it('should invoke documentExists and deleteDocument of fire store service if delete is processed', async () => {
    const mock = contract;
    persistence.documentExists = jest.fn(() => Promise.resolve(true));
    service.delete(mock);
    let spy = jest.spyOn(persistence, 'documentExists');
    await expect(spy).toHaveBeenCalledWith('contracts', mock);
    spy = jest.spyOn(persistence, 'deleteDocument');
    expect(spy).toHaveBeenCalledWith('contracts', mock);
  });

  it('should return an error if document to be deleted does not exist', done => {
    const mock = contract;
    persistence.documentExists = jest.fn(() => Promise.resolve(false));
    service.delete(mock).subscribe(
      _ => {
      },
      err => {
        expect(err).toEqual(new Error(`Document with id ${mock.id} does not exist.`));
        done();
      },
      () => {
      });
  });

  it('should invoke updateDocument of fire store service if update is processed', async () => {
    const mock = contract;
    service.update(mock);
    const spy = jest.spyOn(persistence, 'updateDocument');
    expect(spy).toHaveBeenCalledWith('contracts', mock);
  });

  it('should return message', () => {
    const messageContent = {
      text: 'Der Vertrag 4909 wurde geändert.',
      usage: 'success'
    };
    expect(service.getMessage('contract-update-success', ['4909'])).toEqual(messageContent);
  });
});
