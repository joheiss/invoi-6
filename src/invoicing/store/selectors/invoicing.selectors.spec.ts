import {mockState} from '../../../test/factories/mock-state';
import {Contract} from '../../models/contract.model';
import {mockAllContracts, mockContractsEntity, mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {
  isInvoiceSendable,
  isReceiverDeletable,
  isReceiverQualifiedForQuickInvoice,
  selectActiveContractsForReceiver,
  selectActiveContractsForReceiverAsObjArray,
  selectAllContractsForReceiver,
  selectAllContractsForReceiverCount,
  selectAllInvoicesForContract,
  selectAllInvoicesForContractAsObjArray,
  selectAllInvoicesForContractCount,
  selectAllInvoicesForReceiver,
  selectAllInvoicesForReceiverAsObjArray,
  selectAllInvoicesForReceiverCount,
  selectAllOpenInvoicesWithReceiver,
  selectContractChangeable,
  selectContractPartner,
  selectContractPartnerAsObj,
  selectContractSummaries,
  selectContractSummariesAsArray,
  selectContractSummariesAsSortedArray,
  selectDocumentLinksForContract,
  selectDocumentLinksForInvoice,
  selectDocumentLinksForReceiver,
  selectInvoiceableContractsForReceiver,
  selectInvoiceableContractsForReceiverAsObjArray,
  selectInvoiceContract,
  selectInvoiceContractAsObj,
  selectInvoiceReceiver,
  selectInvoiceReceiverAsObj,
  selectInvoiceSummaries,
  selectInvoiceSummariesAsArray,
  selectInvoiceSummariesAsSortedArray,
  selectLastInvoicesForReceiver,
  selectLastInvoicesForReceiverAsObjArray,
  selectOpenInvoicesForContract,
  selectOpenInvoicesForContractAsObjArray,
  selectOpenInvoicesForReceiver,
  selectOpenInvoicesForReceiverAsObjArray,
  selectReceiverSummaries,
  selectReceiverSummariesAsArray,
  selectRecentContractsForReceiver,
  selectRecentContractsForReceiverAsObjArray,
  selectSelectableContractsForInvoice,
  selectSelectableContractsForInvoiceAsObjArray
} from './invoicing.selectors';
import {mockAllInvoices, mockInvoicesEntity, mockSingleInvoice} from '../../../test/factories/mock-invoices.factory';
import {Invoice, InvoiceStatus} from '../../models/invoice.model';
import {mockAllReceivers, mockReceiversEntity, mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {Receiver} from '../../models/receiver.model';
import {ContractSummary, InvoiceSummary, ReceiverSummary} from '../../models/invoicing.model';
import {mockAllDocumentLinks} from '../../../test/factories/mock-document-links.factory';
import {DocumentLinkType} from '../../models/document-link';

describe('Invoicing Selectors', () => {

  let state;

  beforeEach(() => {
    state = mockState();
  });

  describe('selectAllOpenInvoicesWithReceiver', () => {
    it('should return all open invoices with receiver id and name', () => {
      const receivers = mockReceiversEntity();
      const expected = mockAllInvoices()
        .map(i => Invoice.createFromData(i))
        .filter(i => i.isOpen())
        .map(i => {
          return {
            id: i.header.id,
            issuedAt: i.header.issuedAt,
            billingPeriod: i.header.billingPeriod,
            receiverId: i.header.receiverId,
            receiverName: receivers[i.header.receiverId].name,
            netValue: i.netValue,
            paymentAmount: i.paymentAmount,
            dueDate: i.dueDate
          };
        });
      expect(selectAllOpenInvoicesWithReceiver(state)).toEqual(expected);
    });
  });

  describe('selectAllContractsForReceiver', () => {
    it('should return all contracts for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id);
      expect(selectAllContractsForReceiver(state)).toEqual(expected);
    });
  });

  describe('selectRecentContractsForReceiver', () => {
    it('should return last max 5 contracts for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .sort((a, b) => b.id.localeCompare(a.id))
        .slice(0, 5);
      expect(selectRecentContractsForReceiver(state)).toEqual(expected);
    });
  });

  describe('selectRecentContractsForReceiverAsObjArray', () => {
    it('should return last max 5 contracts for a given receiver as objects', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .sort((a, b) => b.id.localeCompare(a.id))
        .slice(0, 5)
        .map(c => Contract.createFromData(c));
      expect(selectRecentContractsForReceiverAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectActiveContractsForReceiver', () => {
    it('should return active contracts for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .map(c => Contract.createFromData(c))
        .filter(c => c.isActive())
        .map(c => c.data);
      expect(selectActiveContractsForReceiver(state)).toEqual(expected);
    });
  });

  describe('selectActiveContractsForReceiverAsObjArray', () => {
    it('should return active contracts for a given receiver as objects', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .map(c => Contract.createFromData(c))
        .filter(c => c.isActive());
      expect(selectActiveContractsForReceiverAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceableContractsForReceiver', () => {
    it('should return all invoiceable contracts for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .map(c => Contract.createFromData(c))
        .filter(c => c.isInvoiceable())
        .map(c => c.data);
      expect(selectInvoiceableContractsForReceiver(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceableContractsForReceiverAsObjArray', () => {
    it('should return all invoiceable contracts for a given receiver as objects', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .map(c => Contract.createFromData(c))
        .filter(c => c.isInvoiceable());
      expect(selectInvoiceableContractsForReceiverAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectAllInvoicesForReceiver', () => {
    it('should return all invoices for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllInvoices()
        .filter(i => i.receiverId === receiver.id);
      expect(selectAllInvoicesForReceiver(state)).toEqual(expected);
    });
  });

  describe('selectAllInvoicesForReceiverAsObjArray', () => {
    it('should return all invoices for a given receiver as objects', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllInvoices()
        .filter(i => i.receiverId === receiver.id)
        .map(i => Invoice.createFromData(i));
      expect(selectAllInvoicesForReceiverAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectOpenInvoicesForReceiver', () => {
    it('should return open invoices for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllInvoices()
        .filter(i => i.receiverId === receiver.id)
        .map(i => Invoice.createFromData(i))
        .filter(i => i.isOpen())
        .map(i => i.data);
      expect(selectOpenInvoicesForReceiver(state)).toEqual(expected);
    });
  });

  describe('selectOpenInvoicesForReceiverAsObjArray', () => {
    it('should return open invoices for a given receiver as objects', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllInvoices()
        .filter(i => i.receiverId === receiver.id)
        .map(i => Invoice.createFromData(i))
        .filter(i => i.isOpen());
      expect(selectOpenInvoicesForReceiverAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectLastInvoicesForReceiver', () => {
    it('should return last invoice for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllInvoices()
        .filter(i => i.receiverId === receiver.id)
        .sort((a, b) => b.id.localeCompare(a.id))
        .slice(0, 1);
      expect(selectLastInvoicesForReceiver(state)).toEqual(expected);
    });
  });

  describe('selectLastInvoicesForReceiverAsObjArray', () => {
    it('should return last invoice for a given receiver as objects', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllInvoices()
        .filter(i => i.receiverId === receiver.id)
        .sort((a, b) => b.id.localeCompare(a.id))
        .slice(0, 1)
        .map(i => Invoice.createFromData(i));
      expect(selectLastInvoicesForReceiverAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectContractPartner', () => {
    it('should return receiver for a given contract', () => {
      const contract = mockSingleContract();
      const expected = mockAllReceivers()
        .filter(r => r.id === contract.customerId)[0];
      expect(selectContractPartner(state)).toEqual(expected);
    });
  });

  describe('selectContractPartnerAsObj', () => {
    it('should return receiver for a given contract as object', () => {
      const contract = mockSingleContract();
      const expected = mockAllReceivers()
        .filter(r => r.id === contract.customerId)
        .map(r => Receiver.createFromData(r))[0];
      expect(selectContractPartnerAsObj(state)).toEqual(expected);
    });
  });

  describe('selectAllInvoicesForContract', () => {
    it('should return all invoices for a given contract', () => {
      const contract = mockSingleContract();
      const expected = mockAllInvoices()
        .filter(i => i.contractId === contract.id);
      expect(selectAllInvoicesForContract(state)).toEqual(expected);
    });
  });

  describe('selectAllInvoicesForContractAsObjArray', () => {
    it('should return all invoices for a given contract as objects', () => {
      const contract = mockSingleContract();
      const expected = mockAllInvoices()
        .filter(i => i.contractId === contract.id)
        .map(i => Invoice.createFromData(i));
      expect(selectAllInvoicesForContractAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectAllInvoicesForContractCount', () => {
    it('should return number of invoices for a given contract', () => {
      const contract = mockSingleContract();
      const expected = mockAllInvoices()
        .filter(i => i.contractId === contract.id);
      expect(selectAllInvoicesForContractCount(state)).toEqual(expected.length);
    });
  });

  describe('selectOpenInvoicesForContract', () => {
    it('should return open invoices for a given contract', () => {
      const contract = mockSingleContract();
      const expected = mockAllInvoices()
        .filter(i => i.contractId === contract.id)
        .map(i => Invoice.createFromData(i))
        .filter(i => i.isOpen())
        .map(i => i.data);
      expect(selectOpenInvoicesForContract(state)).toEqual(expected);
    });
  });

  describe('selectOpenInvoicesForContractAsObjArray', () => {
    it('should return open invoices for a given contract as objects', () => {
      const contract = mockSingleContract();
      const expected = mockAllInvoices()
        .filter(i => i.contractId === contract.id)
        .map(i => Invoice.createFromData(i))
        .filter(i => i.isOpen());
      expect(selectOpenInvoicesForContractAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectContractChangeable', () => {
    it('should return false if contract has invoices assigned', () => {
      const contract = mockSingleContract();
      const expected = !mockAllInvoices().some(i => i.contractId === contract.id);
      expect(selectContractChangeable(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceReceiver', () => {
    it('should return the receiver for a given invoice', () => {
      const expected = mockSingleReceiver();
      expect(selectInvoiceReceiver(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceReceiverAsObj', () => {
    it('should return the receiver for a given invoice as object', () => {
      const expected = Receiver.createFromData(mockSingleReceiver());
      expect(selectInvoiceReceiverAsObj(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceContract', () => {
    it('should return the contract for a given invoice', () => {
      const expected = mockSingleContract();
      expect(selectInvoiceContract(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceContractAsObj', () => {
    it('should return the contract for a given invoice as object', () => {
      const expected = Contract.createFromData(mockSingleContract());
      expect(selectInvoiceContractAsObj(state)).toEqual(expected);
    });
  });

  describe('selectSelectableContractsForInvoice', () => {
    it('should return the contracts which can be assigned to a given invoice', () => {
      const expected = mockAllContracts()
        .map(c => Contract.createFromData(c))
        .filter(c => c.isInvoiceable())
        .map(c => c.data);
      expect(selectSelectableContractsForInvoice(state)).toEqual(expected);
    });
  });

  describe('selectSelectableContractsForInvoiceAsObjArray', () => {
    it('should return the contracts which can be assigned to a given invoice', () => {
      const expected = mockAllContracts()
        .map(c => Contract.createFromData(c))
        .filter(c => c.isInvoiceable());
      expect(selectSelectableContractsForInvoiceAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectAllInvoicesForReceiverCount', () => {
    it('should return the number of invoices a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllInvoices()
        .filter(i => i.receiverId === receiver.id);
      expect(selectAllInvoicesForReceiverCount(state)).toEqual(expected.length);
    });
  });

  describe('selectAllContractsForReceiverCount', () => {
    it('should return the number of contracts a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id);
      expect(selectAllContractsForReceiverCount(state)).toEqual(expected.length);
    });
  });

  describe('isReceiverDeletable', () => {
    it('should return false if the receiver is assigned to contracts or invoices', () => {
      const receiver = mockSingleReceiver();
      const countContracts = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .length;
      const countInvoices = mockAllInvoices()
        .filter(i => i.receiverId === receiver.id)
        .length;
      expect(isReceiverDeletable(state)).toEqual(countContracts === 0 && countInvoices === 0);
    });
  });

  describe('isReceiverQualifiedForQuickInvoice', () => {
    it('should return true if receiver has exactly one invoiceable contract assigned', () => {
      const receiver = mockSingleReceiver();
      const countContracts = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .map(c => Contract.createFromData(c))
        .filter(c => c.isInvoiceable())
        .length;
      expect(isReceiverQualifiedForQuickInvoice(state)).toEqual(countContracts === 1);
    });
  });

  describe('selectContractSummaries', () => {
    it('should return an array of summaries - one for each contract', () => {
      const expected = buildContractSummaries();
      expect(selectContractSummaries(state)).toEqual(expected);
    });
  });

  describe('selectContractSummariesAsArray', () => {
    it('should return an array of summaries - one for each contract', () => {
      const summaries = buildContractSummaries();
      const expected = Object.keys(summaries).map(s => summaries[s]);
      expect(selectContractSummariesAsArray(state)).toEqual(expected);
    });
  });

  describe('selectContractSummariesAsSortedArray', () => {
    it('should return an array of summaries - one for each contract', () => {
      const summaries = buildContractSummaries();
      const expected = Object.keys(summaries)
        .map(s => summaries[s])
        .sort((a: ContractSummary, b: ContractSummary) => b.object.header.issuedAt.getTime() - a.object.header.issuedAt.getTime());
      expect(selectContractSummariesAsSortedArray(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceSummaries', () => {
    it('should return an array of summaries - one for each invoice', () => {
      const expected = buildInvoiceSummaries();
      expect(selectInvoiceSummaries(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceSummariesAsArray', () => {
    it('should return an array of summaries - one for each invoice', () => {
      const summaries = buildInvoiceSummaries();
      const expected = Object.keys(summaries).map(s => summaries[s]);
      expect(selectInvoiceSummariesAsArray(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceSummariesAsSortedArray', () => {
    it('should return an array of summaries - one for each invoice', () => {
      const summaries = buildInvoiceSummaries();
      const expected = Object.keys(summaries)
        .map(s => summaries[s])
        .sort((a: InvoiceSummary, b: InvoiceSummary) => b.object.header.id.localeCompare(a.object.header.id));
      expect(selectInvoiceSummariesAsSortedArray(state)).toEqual(expected);
    });
  });

  describe('selectReceiverSummaries', () => {
    it('should return an array of summaries - one for each receiver', () => {
      const expected = buildReceiverSummaries();
      expect(selectReceiverSummaries(state)).toEqual(expected);
    });
  });

  describe('selectReceiverSummariesAsArray', () => {
    it('should return an array of summaries - one for each receiver', () => {
      const summaries = buildReceiverSummaries();
      const expected = Object.keys(summaries).map(s => summaries[s]);
      expect(selectReceiverSummariesAsArray(state)).toEqual(expected);
    });
  });

  describe('selectDocumentLinksForInvoice', () => {
    it('should return all document links for a given invoice', () => {
      const invoice = mockSingleInvoice();
      const expected = mockAllDocumentLinks()
        .filter(d => d.owner === `${invoice.objectType}/${invoice.id}`);
      expect(selectDocumentLinksForInvoice(state)).toEqual(expected);
    });
  });

  describe('selectDocumentLinksForContract', () => {
    it('should return all document links for a given contract', () => {
      const contract = mockSingleContract();
      const expected = mockAllDocumentLinks()
        .filter(d => d.owner === `${contract.objectType}/${contract.id}`);
      expect(selectDocumentLinksForContract(state)).toEqual(expected);
    });
  });

  describe('selectDocumentLinksForReceiver', () => {
    it('should return all document links for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllDocumentLinks()
        .filter(d => d.owner === `${receiver.objectType}/${receiver.id}`);
      expect(selectDocumentLinksForReceiver(state)).toEqual(expected);
    });
  });

  describe('isInvoiceSendable', () => {
    it('should return true if invoice PDF has been created and not yet been sent to receiver', () => {
      const invoice = mockSingleInvoice();
      const docLinks = mockAllDocumentLinks()
        .filter(d => d.owner === `${invoice.objectType}/${invoice.id}`)
        .filter(d => d.attachToEmail && d.type === DocumentLinkType.Invoice.valueOf());
      const expected = invoice.status === InvoiceStatus.created.valueOf() && docLinks.length > 0;
      expect(isInvoiceSendable(state)).toEqual(expected);
    });
  });
});

const buildContractSummaries = (): ContractSummary => {
  const contracts = mockContractsEntity();
  const receivers = mockReceiversEntity();
  const invoices = mockInvoicesEntity();
  const summaries = {} as ContractSummary;
  Object.keys(contracts).forEach(k => {
    summaries[k] = {
      object: Contract.createFromData(contracts[k]),
      receiverName: receivers[contracts[k].customerId].name,
      revenue: 0,
      changeable: false,
      lastInvoiceId: ''
    };
    Object.keys(invoices)
      .filter(i => invoices[i].contractId === contracts[k].id)
      .forEach(i => {
        const invoice = Invoice.createFromData(invoices[i]);
        summaries[k].revenue = summaries[k].revenue + invoice.netValue;
        if (i > summaries[k].lastInvoiceId) {
          summaries[k].lastInvoiceId = i;
        }
      });
    summaries[k].changeable = summaries[k].lastInvoiceId.length === 0;
  });
  return summaries;
};

const buildInvoiceSummaries = (): InvoiceSummary => {
  const receivers = mockReceiversEntity();
  const invoices = mockInvoicesEntity();
  const summaries = {} as InvoiceSummary;
  Object.keys(invoices).forEach(k => {
    summaries[k] = {
      object: Invoice.createFromData(invoices[k]),
      receiverName: receivers[invoices[k].receiverId].name,
      changeable: invoices[k].status === InvoiceStatus.created.valueOf()
    };
  });
  return summaries;
};

const buildReceiverSummaries = (): ReceiverSummary => {
  const contracts = mockContractsEntity();
  const receivers = mockReceiversEntity();
  const invoices = mockInvoicesEntity();
  const summaries = {} as ReceiverSummary;
  Object.keys(receivers).forEach(k => {
    summaries[k] = {
      object: Receiver.createFromData(receivers[k]),
      deletable: false,
      activeContractsCount: 0,
      expiredContractsCount: 0,
      lastContractId: '',
      dueInvoicesCount: 0,
      openInvoicesCount: 0,
      lastInvoiceId: ''
    };
    Object.keys(contracts)
      .filter(c => contracts[c].customerId === receivers[k].id)
      .forEach(c => {
        const contract = Contract.createFromData(contracts[c]);
        if (contract.isActive() || contract.isFuture()) {
          ++summaries[k].activeContractsCount;
        } else {
          ++summaries[k].expiredContractsCount;
        }
        if (c > summaries[k].lastContractId) {
          summaries[k].lastContractId = c;
        }
      });
    Object.keys(invoices)
      .filter(i => invoices[i].receiverId === receivers[k].id)
      .forEach(i => {
        const invoice = Invoice.createFromData(invoices[i]);
        if (invoice.isDue()) {
          summaries[k].dueInvoicesCount++;
        }
        if (invoice.isOpen()) {
          summaries[k].openInvoicesCount++;
        }
        if (i > summaries[k].lastInvoiceId) {
          summaries[k].lastInvoiceId = i;
        }
      });
    summaries[k].deletable = !(summaries[k].lastContractId.length || summaries[k].lastInvoiceId.length);
  });
  return summaries;
};
