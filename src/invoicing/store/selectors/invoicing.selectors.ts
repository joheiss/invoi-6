import {createSelector} from '@ngrx/store';
import {Contract} from '../../models/contract.model';
import {Receiver} from '../../models/receiver.model';
import {Invoice, InvoiceStatus} from '../../models/invoice.model';
import {ContractSummaries, ContractSummary, InvoiceSummaries, InvoiceSummary, ReceiverSummaries} from '../../models/invoicing.model';

import * as receiverSelectors from './receivers.selectors';
import * as contractSelectors from './contracts.selectors';
import * as invoiceSelectors from './invoices.selectors';
import * as documentLinkSelectors from './document-links.selectors';
import {DocumentLink} from '../../models/document-link';
import {selectInvoiceableContracts} from './contracts.selectors';

export const selectAllContractsForReceiver = createSelector(
  receiverSelectors.selectCurrentReceiver,
  contractSelectors.selectAllContracts,
  (receiver, contracts) => receiver && contracts && contracts.filter(contract => contract.customerId === receiver.id)
);

export const selectAllContractsForReceiverAsObjArray = createSelector(
  selectAllContractsForReceiver,
  contracts => contracts && contracts.map(contract => Contract.createFromData(contract))
);

export const selectRecentContractsForReceiver = createSelector(
  selectAllContractsForReceiver,
  (contracts) => contracts && contracts.sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5)
);

export const selectRecentContractsForReceiverAsObjArray = createSelector(
  selectRecentContractsForReceiver,
  contracts => contracts && contracts.map(contract => Contract.createFromData(contract))
);

export const selectActiveContractsForReceiver = createSelector(
  receiverSelectors.selectCurrentReceiver,
  contractSelectors.selectActiveContracts,
  (receiver, contracts) => receiver && contracts && contracts.filter(contract => contract.customerId === receiver.id)
);

export const selectActiveContractsForReceiverAsObjArray = createSelector(
  selectActiveContractsForReceiver,
  contracts => contracts && contracts.map(contract => Contract.createFromData(contract))
);

export const selectExpiredContractsForReceiver = createSelector(
  receiverSelectors.selectCurrentReceiver,
  contractSelectors.selectExpiredContracts,
  (receiver, contracts) => receiver && contracts && contracts.filter(contract => contract.customerId === receiver.id)
);

export const selectExpiredContractsForReceiverAsObjArray = createSelector(
  selectActiveContractsForReceiver,
  contracts => contracts && contracts.map(contract => Contract.createFromData(contract))
);

export const selectInvoiceableContractsForReceiver = createSelector(
  receiverSelectors.selectCurrentReceiver,
  contractSelectors.selectInvoiceableContracts,
  (receiver, contracts) => receiver && contracts && contracts.filter(contract => contract.customerId === receiver.id)
);

export const selectInvoiceableContractsForReceiverAsObjArray = createSelector(
  selectInvoiceableContractsForReceiver,
  contracts => contracts && contracts.map(contract => Contract.createFromData(contract))
);

export const selectLastContractsForReceiver = createSelector(
  selectAllContractsForReceiver,
  contracts => {
    // console.log('selectLastContractsForReceiver: ', contracts);
    if (contracts && contracts.length > 0) {
      const lastId = contracts
        .map(contract => contract.id)
        .reduce((last: string, curr: string) => last.localeCompare(curr) >= 0 ? last : curr, '');
      if (lastId) {
        return contracts.filter(contract => contract.id === lastId);
      } else {
        return [];
      }
    }
  }
);

export const selectLastContractsForReceiverAsObjArray = createSelector(
  selectLastContractsForReceiver,
  contracts => contracts && contracts.map(contract => Contract.createFromData(contract))
);

export const selectAllInvoicesForReceiver = createSelector(
  receiverSelectors.selectCurrentReceiver,
  invoiceSelectors.selectAllInvoices,
  (receiver, invoices) => receiver && invoices && invoices.filter(invoice => invoice.receiverId === receiver.id)
);

export const selectAllInvoicesForReceiverAsObjArray = createSelector(
  selectAllInvoicesForReceiver,
  invoices => invoices && invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectOpenInvoicesForReceiver = createSelector(
  selectAllInvoicesForReceiverAsObjArray,
  invoices => invoices && invoices.filter(invoice => invoice.isOpen()).map(invoice => invoice.data)
);

export const selectOpenInvoicesForReceiverAsObjArray = createSelector(
  selectOpenInvoicesForReceiver,
  invoices => invoices && invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectBilledInvoicesForReceiver = createSelector(
  selectOpenInvoicesForReceiverAsObjArray,
  invoices => invoices && invoices.filter(invoice => invoice.isBilled()).map(invoice => invoice.data)
);

export const selectBilledInvoicesForReceiverAsObjArray = createSelector(
  selectBilledInvoicesForReceiver,
  invoices => invoices && invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectDueInvoicesForReceiver = createSelector(
  selectOpenInvoicesForReceiverAsObjArray,
  invoices => invoices && invoices.filter(invoice => invoice.isDue()).map(invoice => invoice.data)
);

export const selectDueInvoicesForReceiverAsObjArray = createSelector(
  selectDueInvoicesForReceiver,
  invoices => invoices && invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectPaidInvoicesForReceiver = createSelector(
  selectAllInvoicesForReceiverAsObjArray,
  invoices => invoices && invoices.filter(invoice => invoice.isPaid()).map(invoice => invoice.data)
);

export const selectPaidInvoicesForReceiverAsObjArray = createSelector(
  selectPaidInvoicesForReceiver,
  invoices => invoices && invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectLastInvoicesForReceiver = createSelector(
  selectAllInvoicesForReceiver,
  invoices => invoices && invoices.length > 0 &&
    [invoices.reduce((last, curr) => last && last.id >= curr.id ? last : last = curr)]
);

export const selectLastInvoicesForReceiverAsObjArray = createSelector(
  selectLastInvoicesForReceiver,
  invoices => invoices && invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectContractPartner = createSelector(
  contractSelectors.selectCurrentContract,
  receiverSelectors.selectReceiverEntities,
  (contract, entity) => contract && entity[contract.customerId]
);

export const selectContractPartnerAsObj = createSelector(
  selectContractPartner,
  receiver => receiver && Receiver.createFromData(receiver)
);

export const selectAllInvoicesForContract = createSelector(
  contractSelectors.selectCurrentContract,
  invoiceSelectors.selectAllInvoices,
  (contract, invoices) => contract && invoices && invoices.filter(invoice => invoice.contractId === contract.id)
);

export const selectAllInvoicesForContractAsObjArray = createSelector(
  selectAllInvoicesForContract,
  invoices => invoices && invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectAllInvoicesForContractCount = createSelector(
  selectAllInvoicesForContract,
  invoices => invoices && invoices.length
);

export const selectOpenInvoicesForContract = createSelector(
  selectAllInvoicesForContract,
  invoices => invoices && invoices.filter(invoice => invoice.status !== 2)
);

export const selectOpenInvoicesForContractAsObjArray = createSelector(
  selectOpenInvoicesForContract,
  invoices => invoices && invoices.map(invoice => Invoice.createFromData(invoice))
);

export const selectContractChangeable = createSelector(
  selectAllInvoicesForContractCount,
  invoicesCount => invoicesCount === 0
);

export const selectContractDeletable = createSelector(
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
  receiver => receiver && Receiver.createFromData(receiver)
);

export const selectInvoiceContract = createSelector(
  invoiceSelectors.selectCurrentInvoice,
  contractSelectors.selectContractEntities,
  (invoice, entity) => invoice && entity[invoice.contractId]
);

export const selectInvoiceContractAsObj = createSelector(
  selectInvoiceContract,
  contract => contract && Contract.createFromData(contract)
);

export const selectSelectableContractsForInvoice = createSelector(
  selectInvoiceContract,
  contractSelectors.selectInvoiceableContracts,
  (invoiceContract, contracts) => {
    // console.log('selectSelectableContractsForInvoice: ', invoiceContract, contracts);
    if (!invoiceContract || contracts.findIndex(contract => contract.id === invoiceContract.id) >= 0) {
      return contracts;
    } else {
      const extended = contracts;
      extended.push(invoiceContract);
      return extended;
    }
  });

export const selectSelectableContractsForInvoiceAsObjArray = createSelector(
  selectSelectableContractsForInvoice,
  contracts => contracts.map(contract => Contract.createFromData(contract))
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
    const contractsForQuickCreate = contracts
      .map(contractData => Contract.createFromData(contractData))
      .filter(contract => contract.isInvoiceable());
    return !!(contractsForQuickCreate && contractsForQuickCreate.length === 1);
  }
);

export const selectContractSummaries = createSelector(
  contractSelectors.selectContractEntities,
  receiverSelectors.selectReceiverEntities,
  (contracts, receivers) => {
    const summaries = {} as ContractSummaries;
    Object.keys(contracts)
      .forEach(contractId => {
        const receiver = receivers[contracts[contractId].customerId];
        summaries[contractId] = {
          object: Contract.createFromData(contracts[contractId]),
          receiverName: receiver ? receivers[contracts[contractId].customerId].name : 'Unbekannt',
          revenue: contracts[contractId].revenue,
          changeable: contracts[contractId].isDeletable,
          lastInvoiceId: contracts[contractId].lastInvoiceId
        };
      });
    return summaries;
  });

export const selectContractSummariesAsArray = createSelector(
  selectContractSummaries,
  summaries => Object.keys(summaries).map(id => summaries[+id])
);

export const selectContractSummariesAsSortedArray = createSelector(
  selectContractSummariesAsArray,
  summaries => summaries.sort((a: ContractSummary, b: ContractSummary) =>
    b.object.header.issuedAt.getTime() - a.object.header.issuedAt.getTime())
);

export const selectInvoiceSummaries = createSelector(
  invoiceSelectors.selectInvoiceEntities,
  receiverSelectors.selectReceiverEntities,
  (invoices, receivers) => {
    const summaries = {} as InvoiceSummaries;
    Object.keys(invoices)
      .map(invoiceId => +invoiceId)
      .forEach(invoiceId => {
        const receiver = receivers[invoices[invoiceId].receiverId];
        summaries[invoiceId] = {
          object: Invoice.createFromData(invoices[invoiceId]),
          receiverName: receiver ? receiver.name : 'Unbekannt',
          changeable: invoices[invoiceId].status == InvoiceStatus.created
        };
      });
    return summaries;
  });

export const selectInvoiceSummariesAsArray = createSelector(
  selectInvoiceSummaries,
  summaries => Object.keys(summaries).map(id => summaries[id])
);

export const selectInvoiceSummariesAsSortedArray = createSelector(
  selectInvoiceSummariesAsArray,
  summaries => summaries.sort((a: InvoiceSummary, b: InvoiceSummary) => b.object.header.id.localeCompare(a.object.header.id))
);

export const selectReceiverSummaries = createSelector(
  receiverSelectors.selectReceiverEntities,
  receiverSelectors.selectReceiverIds,
  contractSelectors.selectContractEntities,
  invoiceSelectors.selectInvoiceEntities,
  (receivers, ids: string[], contracts, invoices) => {
    const summaries = {} as ReceiverSummaries;
    ids
      .map(receiverId => receiverId)
      .forEach(receiverId => {
        summaries[receiverId] = {
          object: {} as Receiver,
          deletable: receivers[receiverId].isDeletable,
          activeContractsCount: 0,
          expiredContractsCount: 0,
          lastContractId: receivers[receiverId].lastContractId,
          dueInvoicesCount: 0,
          openInvoicesCount: receivers[receiverId].openInvoiceIds && receivers[receiverId].openInvoiceIds.length || 0,
          lastInvoiceId: receivers[receiverId].lastInvoiceId
        };
        summaries[receiverId].object = Receiver.createFromData(receivers[receiverId]);
        Object.keys(contracts)
          .filter(contractId => contracts[contractId].customerId === receiverId)
          .forEach(contractId => {
            const contract = Contract.createFromData(contracts[contractId]);
            if (contract.isActive() || contract.isFuture()) {
              ++summaries[receiverId].activeContractsCount;
            } else {
              ++summaries[receiverId].expiredContractsCount;
            }
          });
        if (receivers[receiverId].openInvoiceIds) {
          receivers[receiverId].openInvoiceIds
            .forEach(openInvoiceId => {
              const invoice = Invoice.createFromData(invoices[openInvoiceId]);
              if (invoice.isDue()) {
                summaries[receiverId].dueInvoicesCount++;
              }
            });
        }
      });
    return summaries;
  });

export const selectReceiverSummariesAsArray = createSelector(
  selectReceiverSummaries,
  receiverSelectors.selectReceiverIds,
  (summaries: ReceiverSummaries, ids: string[]) => {
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

export const selectInvoiceSendable = createSelector(
  invoiceSelectors.selectCurrentInvoice,
  selectDocumentLinksForInvoice,
  (invoice, documentLinks) => {
    if (invoice.status > 0) {
      return false;
    }
    const links = documentLinks.filter(link => link.attachToEmail);
    if (!links || links.length === 0) {
      return false;
    }
    return true;
  }
);
