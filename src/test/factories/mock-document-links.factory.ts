import {DocumentLink, DocumentLinkType} from '../../invoicing/models/document-link';
import {mockAllInvoices} from './mock-invoices.factory';
import {mockAllContracts} from './mock-contracts.factory';
import {mockAllReceivers} from './mock-receivers.factory';

export const mockSingleDocumentLink = (): DocumentLink => {
  const $id = 1000001;
  const objectType = 'invoices';
  const id = '5901';
  const owner = `${objectType}/${id}`;
  return getBaseDocumentLink($id, owner);
};

export const mockAllDocumentLinks = (): DocumentLink[] => {
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

const getBaseDocumentLink = (id: number, owner): DocumentLink => {
  return {
    $id: id.toString(),
    name: 'Test Document',
    path: `docs/${owner}/test-document.txt`,
    type: DocumentLinkType.Other,
    attachToEmail: false,
    owner: owner
  };
};

