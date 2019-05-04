import {mockState} from '../../../test/factories/mock-state';
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
import {mockAllReceivers, mockReceiversEntity, mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {mockAllDocumentLinks} from '../../../test/factories/mock-document-links.factory';
import {
  ContractFactory,
  ContractSummariesData,
  ContractSummariesFactory,
  ContractSummary,
  DocumentLinkType,
  InvoiceFactory,
  InvoiceStatus,
  InvoiceSummariesData,
  InvoiceSummariesFactory,
  InvoiceSummary,
  ReceiverFactory,
  ReceiverSummariesData,
  ReceiverSummariesFactory,
} from 'jovisco-domain';

describe('Invoicing Selectors', () => {

  let state;

  beforeEach(() => {
    state = mockState();
  });

  describe('selectAllOpenInvoicesWithReceiver', () => {
    it('should return all open invoices with receiver id and name', () => {
      const receivers = mockReceiversEntity();
      const expected = mockAllInvoices()
        .map(i => InvoiceFactory.fromData(i))
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
        })
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
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
        .map(c => ContractFactory.fromData(c));
      expect(selectRecentContractsForReceiverAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectActiveContractsForReceiver', () => {
    it('should return active contracts for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .map(c => ContractFactory.fromData(c))
        .filter(c => c.term.isActive)
        .map(c => c.data);
      expect(selectActiveContractsForReceiver(state)).toEqual(expected);
    });
  });

  describe('selectActiveContractsForReceiverAsObjArray', () => {
    it('should return active contracts for a given receiver as objects', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .map(c => ContractFactory.fromData(c))
        .filter(c => c.term.isActive);
      expect(selectActiveContractsForReceiverAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceableContractsForReceiver', () => {
    it('should return all invoiceable contracts for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .map(c => ContractFactory.fromData(c))
        .filter(c => c.term.isInvoiceable)
        .map(c => c.data);
      expect(selectInvoiceableContractsForReceiver(state)).toEqual(expected);
    });
  });

  describe('selectInvoiceableContractsForReceiverAsObjArray', () => {
    it('should return all invoiceable contracts for a given receiver as objects', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllContracts()
        .filter(c => c.customerId === receiver.id)
        .map(c => ContractFactory.fromData(c))
        .filter(c => c.term.isInvoiceable);
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
        .map(i => InvoiceFactory.fromData(i));
      expect(selectAllInvoicesForReceiverAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectOpenInvoicesForReceiver', () => {
    it('should return open invoices for a given receiver', () => {
      const receiver = mockSingleReceiver();
      const expected = mockAllInvoices()
        .filter(i => i.receiverId === receiver.id)
        .map(i => InvoiceFactory.fromData(i))
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
        .map(i => InvoiceFactory.fromData(i))
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
        .map(i => InvoiceFactory.fromData(i));
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
        .map(r => ReceiverFactory.fromData(r))[0];
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
        .map(i => InvoiceFactory.fromData(i));
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
        .map(i => InvoiceFactory.fromData(i))
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
        .map(i => InvoiceFactory.fromData(i))
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
      const expected = ReceiverFactory.fromData(mockSingleReceiver());
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
      const expected = ContractFactory.fromData(mockSingleContract());
      expect(selectInvoiceContractAsObj(state)).toEqual(expected);
    });
  });

  describe('selectSelectableContractsForInvoice', () => {
    it('should return the contracts which can be assigned to a given invoice', () => {
      const expected = ContractFactory.fromDataArray(mockAllContracts())
        .filter(c => c.term.isInvoiceable)
        .map(c => c.data);
      expect(selectSelectableContractsForInvoice(state)).toEqual(expected);
    });
  });

  describe('selectSelectableContractsForInvoiceAsObjArray', () => {
    it('should return the contracts which can be assigned to a given invoice', () => {
      const expected = ContractFactory.fromDataArray(mockAllContracts())
        .filter(c => c.term.isInvoiceable);
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
        .map(c => ContractFactory.fromData(c))
        .filter(c => c.term.isInvoiceable)
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
        .sort((a: ContractSummary, b: ContractSummary) => {
          const result = b.object.header.issuedAt.getTime() - a.object.header.issuedAt.getTime();
          return result ? result : b.object.header.id.localeCompare(a.object.header.id);
        });
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
        .sort((a: InvoiceSummary, b: InvoiceSummary) => {
          const result = b.object.header.issuedAt.getTime() - a.object.header.issuedAt.getTime();
          return result ? result : b.object.header.id.localeCompare(a.object.header.id);
        });
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
        .filter(d => d.attachToEmail && d.type === DocumentLinkType.Invoice);
      const expected = invoice.status === InvoiceStatus.created && docLinks.length > 0;
      expect(isInvoiceSendable(state)).toEqual(expected);
    });
  });
});

const buildContractSummaries = (): ContractSummariesData => {
  const contracts = mockContractsEntity();
  const receivers = mockReceiversEntity();
  const invoices = mockInvoicesEntity();
  return ContractSummariesFactory.fromEntities(receivers, contracts, invoices);
};

const buildInvoiceSummaries = (): InvoiceSummariesData => {
  const receivers = mockReceiversEntity();
  const invoices = mockInvoicesEntity();
  return InvoiceSummariesFactory.fromEntities(receivers, invoices);
};

const buildReceiverSummaries = (): ReceiverSummariesData => {
  const contracts = mockContractsEntity();
  const receivers = mockReceiversEntity();
  const invoices = mockInvoicesEntity();
  return ReceiverSummariesFactory.fromEntities(receivers, contracts, invoices);
};
