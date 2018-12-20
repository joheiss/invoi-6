import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {Change} from 'firebase-functions/lib/cloud-functions';
import {EventContext} from 'firebase-functions';
import {calcDiscountedNetValue, calcNetValue, calcRevenuePeriod} from '../../shared/src/calculations';
import moment = require('moment');
import * as _ from 'lodash';
import {getRevenues} from '../../shared/src/getters';
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
    return updateNumberRange('contracts', context);
}

export async function handleContractDeletion(snap: DocumentSnapshot, context: EventContext): Promise<any> {
  try {
    // reset number range
    await resetNumberRange('contracts', context);
    // delete assigned document links
    return deleteDocumentLinksForOwner(`${snap.data().objectType}/${context.params.id}`);
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

    if (isInvoiceUpdateRelevantForRevenue(newInvoice, oldInvoice)) {
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

async function updateNumberRange(rangeId: string, context: EventContext): Promise<any> {
  const id = context.params.id;
  const rangeRef = admin.firestore().collection('number-ranges').doc(rangeId);
  return rangeRef.update({lastUsedId: id});
}

async function updateAuth(uid: string, userProfile: any): Promise<any> {
  try {
    await admin.auth().updateUser(uid, {
      displayName: userProfile.displayName,
      disabled: userProfile.isLocked,
      phoneNumber: userProfile.phoneNumber,
      photoURL: userProfile.imageUrl && userProfile.imageUrl.length ? userProfile.imageUrl : null
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
    new: { year: null, month: null, receiverId: null, organization: null, revenue: 0 },
    old: { year: null, month: null, receiverId: null, organization: null, revenue: 0 },
  };
  if (newInvoice) {
    // get new values
    const period: { year: number, month: number} = calcRevenuePeriod(moment(newInvoice.issuedAt.toDate()));
    values.new.year = period.year.toString();
    values.new.month = period.month.toString();
    values.new.receiverId = newInvoice.receiverId;
    values.new.organization = newInvoice.organization;
    values.new.revenue = calcNetValue(newInvoice);
    // console.log('new revenue posting: ', values.new);
  }
  if (oldInvoice) {
    // get old values
    const period: { year: number, month: number} = calcRevenuePeriod(moment(oldInvoice.issuedAt.toDate()));
    values.old.year = period.year.toString();
    values.old.month = period.month.toString();
    values.old.receiverId = oldInvoice.receiverId;
    values.old.organization = oldInvoice.organization;
    values.old.revenue = calcNetValue(oldInvoice);
    // console.log('old revenue posting: ', values.old);
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
    console.log('correct revenue entry: ', values.new.month, values.new.receiverId, revenues.months[values.new.month][values.new.receiverId]);
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
      console.log('correct revenue entry: ', values.old.month, values.old.receiverId, revenues.months[values.old.month][values.old.receiverId]);
      await setRevenues(db, revenues);
    }
  }
  return true;
}


