import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as express from 'express';

import {validateFirebaseIdToken} from './auth-functions';
import {
  handleContractCreation, handleContractDeletion, handleDocumentLinkDeletion,
  handleInvoiceCreation, handleInvoiceDeletion, handleInvoiceUpdate,
  handleReceiverCreation, handleReceiverDeletion, handleUserProfileCreation, handleUserProfileDeletion, handleUserProfileUpdate
} from './update-functions';
import {handleInvoiceEmailSending, handleInvoicePdfCreation, handleUserCreation, handleUserUpdate} from './server-functions';

import {setupI18n} from './utilities/i18n-utilities';
import {handleDocumentDeletion, handleDocumentFinalization, handleMetadataUpdate} from './storage-functions';

setupI18n(['de-DE']);

const app = express();
const options: cors.CorsOptions = {
  origin: true
};
app.use(cors(options));
app.use(validateFirebaseIdToken);
app.route('/new').post(handleUserCreation);
app.route('/:id').post(handleUserUpdate);
app.route('/invoice-pdf/:id').post(handleInvoicePdfCreation);
app.route('/invoice-email/:id').post(handleInvoiceEmailSending);

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

export const invoicing = functions.https.onRequest(app);
export const users = functions.https.onRequest(app);
export const projectId = process.env.GCLOUD_PROJECT;

export const onCreateReceiver = functions.firestore
  .document('receivers/{id}')
  .onCreate(async (snap, context) => handleReceiverCreation(snap, context));

export const onDeleteReceiver = functions.firestore
  .document('receivers/{id}')
  .onDelete(async (snap, context) => handleReceiverDeletion(snap, context));

export const onCreateContract = functions.firestore
  .document('contracts/{id}')
  .onCreate(async (snap, context) => handleContractCreation(snap, context));

export const onDeleteContract = functions.firestore
  .document('contracts/{id}')
  .onDelete(async (snap, context) => handleContractDeletion(snap, context));

export const onCreateInvoice = functions.firestore
  .document('invoices/{id}')
  .onCreate(async (snap, context) => handleInvoiceCreation(snap, context));

export const onDeleteInvoice = functions.firestore
  .document('invoices/{id}')
  .onDelete(async (snap, context) => handleInvoiceDeletion(snap, context));

export const onUpdateInvoice = functions.firestore
  .document('invoices/{id}')
  .onUpdate(async (change, context) => handleInvoiceUpdate(change, context));

export const onCreateUserProfile = functions.firestore
  .document('user-profiles/{id}')
  .onCreate(async (snap, context) => handleUserProfileCreation(snap, context));

export const onDeleteUserProfile = functions.firestore
  .document('user-profiles/{id}')
  .onDelete(async (snap, context) => handleUserProfileDeletion(snap, context));

export const onUpdateUserProfile = functions.firestore
  .document('user-profiles/{id}')
  .onUpdate(async (change, context) => handleUserProfileUpdate(change, context));

export const onDeleteDocumentLink = functions.firestore
  .document('document-links/{id}')
  .onDelete(async (snap, context) => handleDocumentLinkDeletion(snap, context));

export const onDeleteDocument = functions.storage
  .object()
  .onDelete(async (object, context) => handleDocumentDeletion(object, context));

export const onFinalizedDocument = functions.storage
  .object()
  .onFinalize(async (object, context) => handleDocumentFinalization(object, context));

export const onMetadataUpdate = functions.storage
  .object()
  .onMetadataUpdate(async (object, context) => handleMetadataUpdate(object, context));
