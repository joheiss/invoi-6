import {mockAllInvoices} from './mock-invoices.factory';
import {mockAllContracts} from './mock-contracts.factory';
import {mockAllReceivers} from './mock-receivers.factory';
import {documentLinkAdapter, DocumentLinkState} from '../../invoicing/store/reducers/document-links.reducer';
import {DocumentLinkData, DocumentLinkType} from 'jovisco-domain';

export const mockDocumentLinksState = (): DocumentLinkState => {
  const state = documentLinkAdapter.getInitialState();
  return documentLinkAdapter.addMany(mockAllDocumentLinks(), {...state, loading: false, loaded: true, error: undefined});
};

export const mockSingleDocumentLink = (): DocumentLinkData => {
  const $id = 1000001;
  const objectType = 'invoices';
  const id = '5901';
  const owner = `${objectType}/${id}`;
  return getBaseDocumentLink($id, owner);
};

export const mockAllDocumentLinks = (): DocumentLinkData[] => {
  const allReceivers = mockAllReceivers();
  const allContracts = mockAllContracts().sort((a: any, b: any) => a.issuedAt - b.issuedAt);
  const allInvoices = mockAllInvoices().sort((a: any, b: any) => a.issuedAt - b.issuedAt);
  let $id = 1000001;
  let owner;
  return [...allReceivers, ...allContracts, ...allInvoices].map(o => {
    $id++;
    owner = `${o.objectType}/${o.id}`;
    return getBaseDocumentLink($id, owner);
  });
};

export const mockDocumentLinkIds = (): string[] => {
  const allDocumentLinks = mockAllDocumentLinks();
  return allDocumentLinks.map(d => d.$id);
};

export const mockDocumentLinksEntity = (): any => {
  const allDocumentLinks = mockAllDocumentLinks();
  const entity = {};
  allDocumentLinks.map(d => entity[d.$id] = d);
  return entity;
};

const getBaseDocumentLink = (id: number, owner): DocumentLinkData => {
  return {
    $id: id.toString(),
    name: 'Test Document',
    path: `docs/${owner}/test-document.txt`,
    type: DocumentLinkType.Other,
    attachToEmail: false,
    owner: owner
  };
};

