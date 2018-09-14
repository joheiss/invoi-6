import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {Change} from 'firebase-functions/lib/cloud-functions';
import * as _ from 'lodash';
import {calcDiscountedNetValue, calcDueDate, calcNetValue, calcPaymentAmount, calcRevenuePeriod} from '../../shared/src/calculations';
import {getReceiver, getRevenues} from '../../shared/src/getters';
import moment = require('moment');
import {EventContext} from 'firebase-functions';
import {setRevenues} from '../../shared/src/setters';

export async function handleReceiverCreation(snap: DocumentSnapshot, context: EventContext): Promise<any> {
  return updateNumberRange('receivers', context);
}

export async function handleReceiverDeletion(snap: DocumentSnapshot, context: EventContext): Promise<any> {
  // reset number range
  await resetNumberRange('receivers', context);
  // delete assigned document links
  return deleteDocumentLinksForOwner(`${snap.data().objectType}/${context.params.id}`);
}

export async function handleContractCreation(snap: DocumentSnapshot, context: EventContext): Promise<any> {
  try {
    // update number range
    await updateNumberRange('contracts', context);
    // update customer / invoice receiver
    const customerId = snap.data().customerId;
    return updateContractPartner(context, customerId);
  } catch (err) {
    console.error(err);
  }
}

export async function handleContractDeletion(snap: DocumentSnapshot, context: EventContext): Promise<any> {
  try {
    // reset number range
    await resetNumberRange('contracts', context);
    // delete assigned document links
    await deleteDocumentLinksForOwner(`${snap.data().objectType}/${context.params.id}`);
    // reset last contract id and recent contracts on contract partner
    const customerId = snap.data().customerId;
    return updateContractPartner(context, customerId);
  } catch (err) {
    console.error(err);
  }
}

export async function handleContractUpdate(change: Change<DocumentSnapshot>, context: EventContext): Promise<any> {
  try {
    // get old and new state
    const newContract = change.after.data();
    const oldContract = change.before.data();
    let isPartnerUpdated = false;
    // handle changed customer assignment
    if (newContract.customerId !== oldContract.customerId) {
      await updateContractPartner(context, oldContract.customerId);
      await updateContractPartner(context, newContract.customerId);
      isPartnerUpdated = true;
    }
    // handle all other updates
    if (!isPartnerUpdated && isContractUpdateRelevantForPartner(newContract, oldContract)) {
      await updateContractPartner(context, newContract.customerId);
    }
    return true;
  } catch (err) {
    console.error(err);
  }
}

export async function handleInvoiceCreation(snap: DocumentSnapshot, context: EventContext): Promise<any> {
  try {
    // update number range
    let rangeId = 'invoices';
    if (snap.data().billingMethod === 1) {
      rangeId = 'credit-requests';
    }
    await updateNumberRange(rangeId, context);
    // update contract
    const contractId = snap.data().contractId;
    await updateAssignedContract(context, contractId);
    // update invoice receiver
    const receiverId = snap.data().receiverId;
    await updateInvoiceReceiver(context, receiverId);
    // create open invoice entry
    await createOpenInvoiceEntry(snap.data());
    // update revenue reporting
    return updateRevenueReporting(snap.data(), null);
  } catch (err) {
    console.error(err);
  }
}

export async function handleInvoiceDeletion(snap: DocumentSnapshot, context: EventContext): Promise<any> {
  try {
    // reset number range
    let rangeId = 'invoices';
    if (snap.data().billingMethod === 1) {
      rangeId = 'credit-requests';
    }
    await resetNumberRange(rangeId, context);
    // delete assigned document links
    await deleteDocumentLinksForOwner(`${snap.data().objectType}/${context.params.id}`);
    // update contract
    const contractId = snap.data().contractId;
    await updateAssignedContract(context, contractId);
    // update receiver
    const receiverId = snap.data().receiverId;
    await updateInvoiceReceiver(context, receiverId);
    // delete open invoice entry
    await deleteOpenInvoiceEntry(snap.data());
    // update revenue reporting
    return updateRevenueReporting(null, snap.data());
  } catch (err) {
    console.error(err);
  }
}

export async function handleInvoiceUpdate(change: Change<DocumentSnapshot>, context: EventContext): Promise<any> {
  try {
    // get old and new state
    const newInvoice = change.after.data();
    const oldInvoice = change.before.data();
    let isReceiverUpdated = false;
    let isContractUpdated = false;
    // handle changed customer assignment
    if (newInvoice.receiverId !== oldInvoice.receiverId) {
      await updateInvoiceReceiver(context, oldInvoice.receiverId);
      await updateInvoiceReceiver(context, newInvoice.receiverId);
      isReceiverUpdated = true;
    }
    // handle changed contract assignment
    if (newInvoice.contractId !== oldInvoice.contractId) {
      await updateAssignedContract(context, oldInvoice.contractId);
      await updateAssignedContract(context, newInvoice.contractId);
      isContractUpdated = true;
    }
    // handle all other updates
    if (!isReceiverUpdated && isInvoiceUpdateRelevantForReceiver(newInvoice, oldInvoice)) {
      await updateInvoiceReceiver(context, newInvoice.receiverId);
    }
    if (!isContractUpdated && isInvoiceUpdateRelevantForContract(newInvoice, oldInvoice)) {
      await updateAssignedContract(context, newInvoice.contractId);
    }
    if (isInvoiceUpdateRelevantForRevenue(newInvoice, oldInvoice)) {
      await updateOpenInvoiceEntry(newInvoice);
      await updateRevenueReporting(newInvoice, oldInvoice);
    }
    return true;
  } catch (err) {
    console.error(err);
  }
}

export async function handleUserProfileCreation(snap: DocumentSnapshot, context: EventContext): Promise<any> {
  const uid = context.params.id;
  const userProfile = snap.data();
  return updateAuth(uid, userProfile);
}
export async function handleUserProfileDeletion(snap: DocumentSnapshot, context: EventContext): Promise<any> {
  try {
    const uid = context.params.id;
    return admin.auth().setCustomUserClaims(uid, {isAdmin: false, isSales: false});
  } catch (err) {
    console.log(err);
  }
}
export async function handleUserProfileUpdate(change: Change<DocumentSnapshot>, context: EventContext): Promise<any> {
  try {
    const uid = context.params.id;
    const userProfile = change.after.data();
    return updateAuth(uid, userProfile);
  } catch (err) {
    console.log(err);
  }
}

export async function handleDocumentLinkDeletion(snap: DocumentSnapshot, context: EventContext): Promise<any> {
  try {
    const documentLink = snap.data();
    // delete document from storage
    console.log('File to delete: ', documentLink.path);
    const bucket = admin.storage().bucket();
    const file = bucket.file(documentLink.path);
    return file.delete();
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteDocumentLinksForOwner(owner: string): Promise<any> {
  const docs = await admin.firestore().collection('document-links')
    .where('owner', '==', owner)
    .get();
  const batch = admin.firestore().batch();
  docs.forEach(doc => batch.delete(doc.ref));
  return batch.commit();
}

function isContractUpdateRelevantForPartner(newContract, oldContract): boolean {
  if (_.isEqual(newContract, oldContract)) {
    return false;
  }
  // currently no contract change is relevant
  return false;
}

function isInvoiceUpdateRelevantForReceiver(newInvoice, oldInvoice): boolean {
  if (_.isEqual(newInvoice, oldInvoice)) {
    return false;
  }
  // only status changes are currently relevant for the receiver
  if (newInvoice.status !== oldInvoice.status) {
    return true;
  }
  return false;
}

function isInvoiceUpdateRelevantForContract(newInvoice, oldInvoice): boolean {
  if (_.isEqual(newInvoice, oldInvoice)) {
    return false;
  }
  // only status changes and changes in net value are currently relevant for the receiver
  if (newInvoice.status !== oldInvoice.status) {
    return true;
  }
  if (calcNetValue(newInvoice) !== calcNetValue(oldInvoice)) {
    return true;
  }
  return false;
}

function isInvoiceUpdateRelevantForRevenue(newInvoice, oldInvoice): boolean {
  if (_.isEqual(newInvoice, oldInvoice)) {
    return false;
  }
  // only status changes and changes in document date, receiver and discounted value are currently relevant for the receiver
  if (newInvoice.status !== oldInvoice.status) {
    return true;
  }
  if (newInvoice.issuedAt !== oldInvoice.issuedAt) {
    return true;
  }
  if (newInvoice.receiverId !== oldInvoice.receiverId) {
    return true;
  }
  if (calcDiscountedNetValue(newInvoice) !== calcDiscountedNetValue(oldInvoice)) {
    return true;
  }
  return false;
}

async function resetNumberRange(rangeId: string, context: EventContext): Promise<any> {
  const id = context.params.id;
  const rangeRef = admin.firestore().collection('number-ranges').doc(rangeId);
  const range = await rangeRef.get();
  if (range.data().lastUsedId === id) {
    const lastId = (+id - 1).toString();
    return rangeRef.update({lastUsedId: lastId});
  }
  return false;
}

async function updateAssignedContract(context: EventContext, contractId: string): Promise<any> {
  const id = context.params.id;
  let isDeletable = false;
  let lastInvoiceId = id;
  let allInvoiceIds = [];
  let openInvoiceIds = [];
  let revenue = 0;
  // get all invoices for contract
  const invoices = await admin.firestore().collection('invoices').where('contractId', '==', contractId).get();
  const allInvoices = [];
  invoices.forEach(invoice => allInvoices.push(invoice.data()));
  if (allInvoices.length === 0) {
    isDeletable = true;
    lastInvoiceId = '';
  } else {
    revenue = allInvoices.reduce((total, current) => total + calcNetValue(current), 0);
    lastInvoiceId = allInvoices.sort((a, b) => a.issuedAt >= b.issuedAt ? -1 : 0)[0].id;
    allInvoiceIds = allInvoices.map(invoice => invoice.id);
    openInvoiceIds = allInvoices.filter(invoice => invoice.status !== 2).map(invoice => invoice.id);
  }
  const contractRef = admin.firestore().collection('contracts').doc(contractId);
  return contractRef.update({
    isDeletable: isDeletable,
    lastInvoiceId: lastInvoiceId,
    allInvoiceIds: allInvoiceIds,
    openInvoiceIds: openInvoiceIds,
    revenue: revenue
  });
}

async function updateContractPartner(context: EventContext, customerId: string): Promise<any> {
  const id = context.params.id;
  let isDeletable = false;
  let lastContractId = id;
  let allContractIds = [];
  // get recent contracts
  const contracts = await admin.firestore().collection('contracts').where('customerId', '==', customerId).get();
  const allContracts = [];
  contracts.forEach(contract => allContracts.push(contract.data()));
  if (allContracts.length === 0) {
    isDeletable = true;
    lastContractId = '';
  } else {
    allContractIds = allContracts.sort((a, b) => a.issuedAt >= b.issuedAt ? -1 : 0).map(contract => contract.id);
  }
  const receiverRef = admin.firestore().collection('receivers').doc(customerId);
  return receiverRef.update({isDeletable: isDeletable, lastContractId: lastContractId, allContractIds: allContractIds});
}

async function updateInvoiceReceiver(context: EventContext, receiverId: string): Promise<any> {
  const id = context.params.id;
  let lastInvoiceId = id;
  let openInvoiceIds = [];
  // get recent invoices
  const invoices = await admin.firestore().collection('invoices').where('receiverId', '==', receiverId).get();
  const allInvoices = [];
  invoices.forEach(invoice => allInvoices.push(invoice.data()));
  if (allInvoices.length === 0) {
    lastInvoiceId = '';
  } else {
    openInvoiceIds = allInvoices.filter(invoice => invoice.status !== 2).map(invoice => invoice.id);
  }
  const receiverRef = admin.firestore().collection('receivers').doc(receiverId);
  return receiverRef.update({lastInvoiceId: lastInvoiceId, openInvoiceIds: openInvoiceIds});
}

async function updateNumberRange(rangeId: string, context: EventContext): Promise<any> {
  const id = context.params.id;
  const rangeRef = admin.firestore().collection('number-ranges').doc(rangeId);
  return rangeRef.update({lastUsedId: id});
}

async function createOpenInvoiceEntry(invoice: any): Promise<any> {
  if (invoice.status === 2) {
    return false;
  }
  return setOpenInvoiceEntry(invoice);
}

async function deleteOpenInvoiceEntry(invoice: any): Promise<any> {
  // delete entry from open-invoices collection
  const db = admin.firestore();
  return db.collection('open-invoices').doc(invoice.id).delete();
}

async function updateOpenInvoiceEntry(invoice: any): Promise<any> {
  const db = admin.firestore();
  if (invoice.status === 2) {
    return deleteOpenInvoiceEntry(invoice);
  }
  return setOpenInvoiceEntry(invoice);
}

async function setOpenInvoiceEntry(invoice: any): Promise<any> {
  const db = admin.firestore();
  // get receiver name
  const receiver = await getReceiver(db, invoice.receiverId);
  const receiverName = receiver.name;
  // prepare open invoice entry
  const { id, receiverId, issuedAt, billingPeriod, organization, status } = invoice;
  const netValue = calcNetValue(invoice);
  const paymentAmount = calcPaymentAmount(invoice);
  const dueDate = calcDueDate(invoice);
  // add new entry to open-invoices collection
  return db.collection('open-invoices').doc(id).set({
    id, receiverId, receiverName, issuedAt, billingPeriod, netValue, paymentAmount, dueDate, organization, status
  });
}

async function updateAuth(uid: string, userProfile: any): Promise<any> {
  try {
    await admin.auth().updateUser(uid, {
      displayName: userProfile.displayName,
      disabled: userProfile.isLocked,
      phoneNumber: userProfile.phoneNumber,
      photoURL: userProfile.imageUrl
    });
    const isAdmin = userProfile.roles.indexOf('sys-admin') >= 0;
    const isSales = userProfile.roles.indexOf('sales-user') >= 0;
    return admin.auth().setCustomUserClaims(uid, {isAdmin: isAdmin, isSales: isSales});
  } catch (err) {
    throw new Error(err);
  }
}

async function updateRevenueReporting(newInvoice: any, oldInvoice: any): Promise<any> {
  const db = admin.firestore();
  const values = {
    new: {
      year: null,
      month: null,
      receiverId: null,
      organization: null,
      revenue: 0,
    },
    old: {
      year: null,
      month: null,
      receiverId: null,
      organization: null,
      revenue: 0,
    },
  };
  if (newInvoice) {
    // get new values
    const period: { year: number, month: number} = calcRevenuePeriod(moment(newInvoice.issuedAt));
    values.new.year = period.year.toString();
    values.new.month = period.month.toString();
    values.new.receiverId = newInvoice.receiverId;
    values.new.organization = newInvoice.organization;
    values.new.revenue = calcDiscountedNetValue(newInvoice);
  }
  if (oldInvoice) {
    // get old values
    const period: { year: number, month: number} = calcRevenuePeriod(moment(oldInvoice.issuedAt));
    values.old.year = period.year.toString();
    values.old.month = period.month.toString();
    values.old.receiverId = oldInvoice.receiverId;
    values.old.organization = oldInvoice.organization;
    values.old.revenue = calcDiscountedNetValue(oldInvoice);
  }
  if (values.new.year) {
    const docId = `${values.new.year}_${values.new.organization}`;
    let revenues = await getRevenues(db, docId);
    if (!revenues) {
      // create entirely new revenue entry
       revenues = {
         id: values.new.year,
         organization: values.new.organization,
         months: {[values.new.month]: {[values.new.receiverId]: values.new.revenue}}
       };
    } else if (!revenues.months[values.new.month]) {
      // create new entry for month
      revenues.months[values.new.month] = {[values.new.receiverId]: values.new.revenue};
    } else if (!revenues.months[values.new.month][values.new.receiverId]) {
      // create new entry for receiver
      revenues.months[values.new.month][values.new.receiverId] = values.new.revenue;
    } else {
      // add to existing entry
      revenues.months[values.new.month][values.new.receiverId] += values.new.revenue;
    }
    await setRevenues(db, revenues);
  }

  if (values.old.year) {
    const docId = `${values.old.year}_${values.old.organization}`;
    const revenues = await getRevenues(db, docId);
    if (revenues && revenues.months[values.old.month] && revenues.months[values.old.month][values.old.receiverId]) {
      // correct old entry
      revenues.months[values.old.month][values.old.receiverId] = Math.max(
        revenues.months[values.old.month][values.old.receiverId] - values.old.revenue,
        0
      );
      await setRevenues(db, revenues);
    }
  }
  return true;
}

