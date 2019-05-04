import {Request, Response} from 'express';
import * as admin from 'firebase-admin';
import {send, setApiKey} from '@sendgrid/mail';
import * as functions from 'firebase-functions';
import UpdateRequest = admin.auth.UpdateRequest;
import UserRecord = admin.auth.UserRecord;
import {getDocLinksForBusinessObject, getInvoice, getReceiver, updateInvoice} from '../../shared/src';
import {InvoiceStatus} from 'jovisco-domain';
import {InvoiceForm, InvoiceFormDataMapper} from './printforms';

export async function handleInvoicePdfCreation(req: Request, res: Response) {
  try {
    const response = await createInvoicePdf(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function createInvoicePdf(id: string): Promise<any> {
  try {
    const db = admin.firestore();
    // get invoice from firestore
    const invoice = await getInvoice(db, id);
    // get invoice receiver from firestore
    const receiver = await getReceiver(db, invoice.receiverId);
    // prepare invoice PDF
    const formData = new InvoiceFormDataMapper(invoice, receiver).map();
    const invoiceForm = new InvoiceForm(formData);
    invoiceForm.print();
    // store temp file
    await storePdf(invoiceForm, formData.invoiceId);
    return invoice;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

async function storePdf(form: InvoiceForm, id: string): Promise<any> {
  try {
    const tmpPath = `/tmp/R${id}.pdf`;
    const documentPath = `/docs/invoices/${id}/R${id}.pdf`;
    await form.saveAsWithPromise(tmpPath);
    const options = {destination: documentPath};
    const bucket = admin.storage().bucket();
    return bucket.upload(tmpPath, options)
      .then(async f => {
        const customMetadata = {};
        customMetadata['owner'] = `invoices/${id}`;
        customMetadata['type'] = 0;
        customMetadata['attachToEmail'] = true;
        await f[0].setMetadata({...f[0].metadata, metadata: customMetadata});
        const documentLink: any = {};
        documentLink.name = `R${id}.pdf`;
        documentLink.path = f[0].metadata['name'];
        documentLink.type = 0;
        documentLink.attachToEmail = true;
        documentLink.owner = `invoices/${id}`;
        return admin.firestore().collection('document-links').add(documentLink);
      })
      .catch(error => new Error(error));
  } catch (err) {
    throw new Error(err);
  }
}

export async function handleInvoiceEmailSending(req: Request, res: Response) {
  try {
    // console.log('functions.config(): ', functions.config()); // (functions.config().sendgrid.key;
    // const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    // console.log('FIREBASE_CONFIG: ', firebaseConfig);
    const SENDGRID_API_KEY = functions.config().sendgrid.key;
    setApiKey(SENDGRID_API_KEY);
    const response = await sendInvoiceEmail(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

async function sendInvoiceEmail(id: string): Promise<any> {
  const EMAIL_ACCOUNTING = 'accounting@jovisco.de';
  const EMAIL_FROM = 'contact@jovisco.de';
  try {
    const db = admin.firestore();
    // get invoice
    const invoice = await getInvoice(db, id);
    // get invoice receiver
    const receiver = await getReceiver(db, invoice.receiverId);
    const emailTo = receiver.address.email;
    // prepare attachments
    const attachments = await getAttachments(invoice);
    // prepare email
    const email: any = {
      to: emailTo,
      cc: EMAIL_ACCOUNTING,
      from: EMAIL_FROM,
      subject: `Rechnung ${id}`,
      templateId: 'fef476e5-cd98-442d-ad05-451a3832886a',
      substitutionWrappers: ['{{', '}}'],
      substitutions: {
        id: id
      },
      attachments: attachments
    };
    const res = await send(email);
    // update invoice status
    return updateInvoice(db, id, { status: InvoiceStatus.billed});
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

async function getAttachments(invoice: any): Promise<any> {
  const db = admin.firestore();
  // get document links for invoice
  const linkDocs = await getDocLinksForBusinessObject(db, invoice);
  return Promise.all(
    linkDocs.docs
      .filter(link => link.data().attachToEmail)
      .map(async link => await mapAttachment(link.data()))
  );
}

async function mapAttachment(link: any): Promise<any> {
  // retrieve metadata
  const metadata: any = await admin.storage().bucket().file(link.path).getMetadata();
  const contentType = metadata.contentType;
  // download file and perform base64 encoding
  const buffer = await admin.storage().bucket().file(link.path).download();
  const content = Buffer.from(buffer[0]).toString('base64');
  // prepare attachments
  return {
    content: content,
    filename: link.name,
    type: contentType,
    disposition: 'attachment'
  };
}

export async function handleUserCreation(req: Request, res: Response) {
  try {
    await createUser(req.body);
    const response = req.body.user;
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function handleUserUpdate(req: Request, res: Response) {
  try {
    await updateUser(req.body);
    const response = req.body.user;
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function createUser(payload: any): Promise<any> {
  try {
    // create user
    const newUser = buildUserRequest(payload);
    const userInfo = await admin.auth().createUser(newUser);
    // create user profile
    delete(payload.user['uid']);
    return admin.firestore().collection('user-profiles').doc(userInfo.uid).set(payload.user);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

async function updateUser(payload: any): Promise<any> {
  try {
    // update user
    const updates = buildUserRequest(payload);
    const uid = payload.user ? payload.user.uid : payload.uid;
    const userRecord: UserRecord = await admin.auth().updateUser(uid, updates);
    // update user profile
    if (payload.user) {
      delete(payload.user['uid']);
      return admin.firestore().collection('user-profiles').doc(userRecord.uid).set(payload.user);
    }
    return true;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

function buildUserRequest(payload: any): UpdateRequest {
  const userRequest: UpdateRequest = {};
  if (payload.user) {
    if (payload.user.email) {
      userRequest.email = payload.user.email;
    }
    if (payload.user.displayName) {
      userRequest.displayName = payload.user.displayName;
    }
    if (payload.user.isLocked) {
      userRequest.disabled = payload.user.isLocked;
    } else {
      userRequest.disabled = false;
    }
    if (payload.user.phoneNumber && payload.user.phoneNumber.length) {
      userRequest.phoneNumber = payload.user.phoneNumber;
    }
    if (payload.user.imageUrl && payload.user.imageUrl.length) {
      userRequest.photoURL = payload.user.imageUrl;
    }
  }
  if (payload.password) {
    userRequest.password = payload.password;
  }
  return userRequest;
}
