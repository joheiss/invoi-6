import {createSelector} from '@ngrx/store';
import * as receiverSelectors from './receivers.selectors';
import * as contractSelectors from './contracts.selectors';
import * as invoiceSelectors from './invoices.selectors';
import * as documentLinkSelectors from './document-links.selectors';
import {
  ContractFactory,
  ContractSummariesFactory,
  ContractSummary,
  DocumentLinkType,
  Invoice,
  InvoiceFactory,
  InvoiceStatus,
  InvoiceSummariesFactory,
  InvoiceSummary,
  OpenInvoiceFactory,
  ReceiverFactory,
  ReceiverSummariesData,
  ReceiverSummariesFactory
} from 'jovisco-domain';

export const selectAllOpenInvoicesWithReceiver = createSelector(
  invoiceSelectors.selectAllInvoicesAsObjArray,
  receiverSelectors.selectReceiverEntities,
  (invoices, receivers) => {
    return invoices
      .filter((invoice: Invoice) => invoice.isOpen())
      .map(invoice => OpenInvoiceFactory.fromInvoice(invoice, receivers[invoice.header.receiverId].name).data)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }
);
export const selectAllContractsForReceiver = createSelector(
  receiverSelectors.selectCurrentReceiver,
  contractSelectors.selectAllContracts,
  (receiver, contracts) => receiver && contracts && contracts.filter(contract => contract.customerId === receiver.id)
);

export const selectRecentContractsForReceiver = createSelector(
  selectAllContractsForReceiver,
  (contracts) => contracts && contracts.sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5)
);

export const selectRecentContractsForReceiverAsObjArray = createSelector(
  selectRecentContractsForReceiver,
  contracts => contracts && ContractFactory.fromDataArray(contracts)
);

export const selectActiveContractsForReceiver = createSelector(
  receiverSelectors.selectCurrentReceiver,
  contractSelectors.selectActiveContracts,
  (receiver, contracts) => receiver && contracts && contracts.filter(contract => contract.customerId === receiver.id)
);

export const selectActiveContractsForReceiverAsObjArray = createSelector(
  selectActiveContractsForReceiver,
  contracts => contracts && ContractFactory.fromDataArray(contracts)
);

export const selectInvoiceableContractsForReceiver = createSelector(
  receiverSelectors.selectCurrentReceiver,
  contractSelectors.selectInvoiceableContracts,
  (receiver, contracts) => receiver && contracts && contracts.filter(contract => contract.customerId === receiver.id)
);

export const selectInvoiceableContractsForReceiverAsObjArray = createSelector(
  selectInvoiceableContractsForReceiver,
  contracts => contracts && ContractFactory.fromDataArray(contracts)
);

export const selectAllInvoicesForReceiver = createSelector(
  receiverSelectors.selectCurrentReceiver,
  invoiceSelectors.selectAllInvoices,
  (receiver, invoices) => receiver && invoices && invoices.filter(invoice => invoice.receiverId === receiver.id)
);

export const selectAllInvoicesForReceiverAsObjArray = createSelector(
  selectAllInvoicesForReceiver,
  invoices => invoices && InvoiceFactory.fromDataArray(invoices)
);

export const selectOpenInvoicesForReceiver = createSelector(
  selectAllInvoicesForReceiverAsObjArray,
  invoices => invoices && invoices.filter(invoice => invoice.isOpen()).map(invoice => invoice.data)
);

export const selectOpenInvoicesForReceiverAsObjArray = createSelector(
  selectOpenInvoicesForReceiver,
  invoices => invoices && InvoiceFactory.fromDataArray(invoices)
);

export const selectLastInvoicesForReceiver = createSelector(
  selectAllInvoicesForReceiver,
  invoices => invoices && invoices.length > 0 &&
    [invoices.reduce((last, curr) => last && last.id >= curr.id ? last : last = curr)]
);

export const selectLastInvoicesForReceiverAsObjArray = createSelector(
  selectLastInvoicesForReceiver,
  invoices => invoices && invoices.map(invoice => InvoiceFactory.fromData(invoice))
);

export const selectContractPartner = createSelector(
  contractSelectors.selectCurrentContract,
  receiverSelectors.selectReceiverEntities,
  (contract, entity) => contract && entity[contract.customerId]
);

export const selectContractPartnerAsObj = createSelector(
  selectContractPartner,
  receiver => receiver && ReceiverFactory.fromData(receiver)
);

export const selectAllInvoicesForContract = createSelector(
  contractSelectors.selectCurrentContract,
  invoiceSelectors.selectAllInvoices,
  (contract, invoices) => contract && invoices && invoices.filter(invoice => invoice.contractId === contract.id)
);

export const selectAllInvoicesForContractAsObjArray = createSelector(
  selectAllInvoicesForContract,
  invoices => invoices && InvoiceFactory.fromDataArray(invoices)
);

export const selectAllInvoicesForContractCount = createSelector(
  selectAllInvoicesForContract,
  invoices => invoices && invoices.length
);

export const selectOpenInvoicesForContract = createSelector(
  selectAllInvoicesForContract,
  invoices => invoices && invoices.filter(invoice => invoice.status !== InvoiceStatus.paid)
);

export const selectOpenInvoicesForContractAsObjArray = createSelector(
  selectOpenInvoicesForContract,
  invoices => invoices && InvoiceFactory.fromDataArray(invoices)
);

export const selectContractChangeable = createSelector(
  selectAllInvoicesForContractCount,
  invoicesCount => invoicesCount === 0
);

export const selectInvoiceReceiver = createSelector(
  invoiceSelectors.selectCurrentInvoice,
  receiverSelectors.selectReceiverEntities,
  (invoice, entity) => invoice && entity[invoice.receiverId]
);

export const selectInvoiceReceiverAsObj = createSelector(
  selectInvoiceReceiver,
  receiver => receiver && ReceiverFactory.fromData(receiver)
);

export const selectInvoiceContract = createSelector(
  invoiceSelectors.selectCurrentInvoice,
  contractSelectors.selectContractEntities,
  (invoice, entity) => invoice && entity[invoice.contractId]
);

export const selectInvoiceContractAsObj = createSelector(
  selectInvoiceContract,
  contract => contract && ContractFactory.fromData(contract)
);

export const selectSelectableContractsForInvoice = createSelector(
  selectInvoiceContract,
  contractSelectors.selectInvoiceableContracts,
  (invoiceContract, contracts) => {
    console.log('selectSelectableContractsForInvoice: ', invoiceContract, contracts);
    if (!invoiceContract || contracts.findIndex(contract => contract.id === invoiceContract.id) >= 0) {
      return contracts;
    } else {
      return [invoiceContract, ...contracts];
    }
  });

export const selectSelectableContractsForInvoiceAsObjArray = createSelector(
  selectSelectableContractsForInvoice,
  contracts => ContractFactory.fromDataArray(contracts)
);

export const selectAllInvoicesForReceiverCount = createSelector(
  selectAllInvoicesForReceiver,
  invoices => invoices ? invoices.length : 0
);

export const selectAllContractsForReceiverCount = createSelector(
  selectAllContractsForReceiver,
  contracts => contracts ? contracts.length : 0
);

export const isReceiverDeletable = createSelector(
  selectAllContractsForReceiverCount,
  selectAllInvoicesForReceiverCount,
  (contractsCount, invoicesCount) => contractsCount + invoicesCount === 0
);

export const isReceiverQualifiedForQuickInvoice = createSelector(
  selectInvoiceableContractsForReceiver,
  (contracts) => {
    const contractsForQuickCreate = ContractFactory.fromDataArray(contracts)
      .filter(contract => contract.term.isInvoiceable);
    return !!(contractsForQuickCreate && contractsForQuickCreate.length === 1);
  }
);

export const selectContractSummaries = createSelector(
  contractSelectors.selectContractEntities,
  receiverSelectors.selectReceiverEntities,
  invoiceSelectors.selectInvoiceEntities,
  (contracts, receivers, invoices) => ContractSummariesFactory.fromEntities(receivers, contracts, invoices)
);

export const selectContractSummariesAsArray = createSelector(
  selectContractSummaries,
  summaries => Object.keys(summaries).map(id => summaries[+id])
);

export const selectContractSummariesAsSortedArray = createSelector(
  selectContractSummariesAsArray,
  summaries => summaries.sort((a: ContractSummary, b: ContractSummary) => {
    const result = b.object.header.issuedAt.getTime() - a.object.header.issuedAt.getTime();
    return result ? result : b.object.header.id.localeCompare(a.object.header.id);
  })
);

export const selectInvoiceSummaries = createSelector(
  invoiceSelectors.selectInvoiceEntities,
  receiverSelectors.selectReceiverEntities,
  (invoices, receivers) => InvoiceSummariesFactory.fromEntities(receivers, invoices)
);

export const selectInvoiceSummariesAsArray = createSelector(
  selectInvoiceSummaries,
  summaries => Object.keys(summaries).map(id => summaries[id])
);

export const selectInvoiceSummariesAsSortedArray = createSelector(
  selectInvoiceSummariesAsArray,
  summaries => summaries
    .sort((a: InvoiceSummary, b: InvoiceSummary) => {
      const result = b.object.header.issuedAt.getTime() - a.object.header.issuedAt.getTime();
      return result ? result : b.object.header.id.localeCompare(a.object.header.id);
    })
);

export const selectReceiverSummaries = createSelector(
  receiverSelectors.selectReceiverEntities,
  contractSelectors.selectContractEntities,
  invoiceSelectors.selectInvoiceEntities,
  (receivers, contracts, invoices) => ReceiverSummariesFactory.fromEntities(receivers, contracts, invoices)
);

export const selectReceiverSummariesAsArray = createSelector(
  selectReceiverSummaries,
  receiverSelectors.selectReceiverIds,
  (summaries: ReceiverSummariesData, ids: string[]) => {
    return ids.map(id => summaries[id]);
  });

export const selectDocumentLinksForInvoice = createSelector(
  invoiceSelectors.selectCurrentInvoice,
  documentLinkSelectors.selectAllDocumentLinks,
  (invoice, documentLinks) => documentLinks.filter(documentLink => documentLink.owner === `invoices/${invoice.id}`)
);

export const selectDocumentLinksForContract = createSelector(
  contractSelectors.selectCurrentContract,
  documentLinkSelectors.selectAllDocumentLinks,
  (contract, documentLinks) => documentLinks.filter(documentLink => documentLink.owner === `contracts/${contract.id}`)
);

export const selectDocumentLinksForReceiver = createSelector(
  receiverSelectors.selectCurrentReceiver,
  documentLinkSelectors.selectAllDocumentLinks,
  (receiver, documentLinks) => documentLinks.filter(documentLink => documentLink.owner === `receivers/${receiver.id}`)
);

export const isInvoiceSendable = createSelector(
  invoiceSelectors.selectCurrentInvoice,
  selectDocumentLinksForInvoice,
  (invoice, documentLinks) => {
    if (invoice.status !== InvoiceStatus.created) {
      return false;
    }
    const links = documentLinks.filter(link => link.attachToEmail && link.type === DocumentLinkType.Invoice);
    return !(!links || links.length === 0);
  }
);
