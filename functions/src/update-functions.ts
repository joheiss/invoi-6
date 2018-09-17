import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {Change} from 'firebase-functions/lib/cloud-functions';
import {EventContext} from 'firebase-functions';

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
    return updateNumberRange(rangeId, context);
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
    return deleteDocumentLinksForOwner(`${snap.data().objectType}/${context.params.id}`);
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
      photoURL: userProfile.imageUrl
    });
    const isAdmin = userProfile.roles.indexOf('sys-admin') >= 0;
    const isSales = userProfile.roles.indexOf('sales-user') >= 0;
    return admin.auth().setCustomUserClaims(uid, {isAdmin: isAdmin, isSales: isSales});
  } catch (err) {
    throw new Error(err);
  }
}


