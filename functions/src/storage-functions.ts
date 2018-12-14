import * as admin from 'firebase-admin';
import {ObjectMetadata} from 'firebase-functions/lib/providers/storage';
import * as path from 'path';
import * as os from 'os';
import * as _ from 'lodash';
import * as sharp from 'sharp';
import {EventContext} from 'firebase-functions';

export async function handleDocumentDeletion(object: ObjectMetadata, context: EventContext): Promise<any> {
  const filePath = object.name;
  const metadata = object.metadata;
  if (filePath.startsWith('images/users/')) {
    return false;
  }
  if (!metadata || !metadata['owner']) {
    return false;
  }
  return deleteDocumentLink(object.name);
}

export async function handleDocumentFinalization(object: ObjectMetadata, context: EventContext): Promise<any> {
  const filePath = object.name;
  const metadata = object.metadata;
  if (filePath.startsWith('images/users/')) {
    return handleUserThumbnail(object, context);
  }
  if (!metadata || !metadata['owner']) {
    return false;
  }
  // create or update
  const documentLink = {
    name: path.basename(object.name),
    path: object.name,
    type: +metadata['type'],
    attachToEmail: (metadata['attachToEmail']) === 'true',
    owner: metadata['owner']
  };
  return updateDocumentLink(documentLink);
}

export async function handleMetadataUpdate(object: ObjectMetadata, context: EventContext): Promise<any> {
  const filePath = object.name;
  const metadata = object.metadata;
  return false;
}

export async function handleUserThumbnail(object: ObjectMetadata, context: EventContext): Promise<any> {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;
  const metadata = object.metadata;
  const SIZES = [32, 64]; // [64, 256, 512];
  if (!contentType.startsWith('image/')) {
    console.log(`File at ${filePath} is not an image. No further processing.`);
    return false;
  }
  if (_.includes(filePath, '_thumb')) {
    console.log(`File at ${filePath} is already a thumbnail.`);
    return false;
  }
  const fileName = filePath.split('/').pop();
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const bucket = admin.storage().bucket(fileBucket);
  return bucket.file(filePath).download({destination: tempFilePath})
    .then(() => {
      _.each(SIZES, (size, index) => {
        const newFileName = `profile-image_${size}_thumb.png`;
        const newFileTemp = path.join(os.tmpdir(), newFileName);
        const newFilePath = `${filePath.substring(0, filePath.lastIndexOf('/'))}/thumbs/${newFileName}`;
        sharp(tempFilePath)
          .resize(size, null)
          .toFile(newFileTemp, (err, info) => {
            bucket.upload(newFileTemp, {destination: newFilePath})
              .then(file => file[0].makePublic())
              .then(response => {
                if (index === 0) {
                  updateUserProfile(newFilePath);
                }
              });
          });
        console.log(`Thumbnail ${newFilePath} created and stored.`);
      });
    });
}

export async function createDocumentLink(documentLink): Promise<any> {
  return admin.firestore().collection('document-links').add(documentLink);
}

export async function deleteDocumentLink(documentPath: string): Promise<any> {
  const queryRef = await admin.firestore().collection('document-links').where('path', '==', documentPath).get();
  if (queryRef.docs.length === 0) {
    return false;
  }
  const batch = admin.firestore().batch();
  queryRef.docs.forEach(doc => batch.delete(doc.ref));
  return batch.commit();
}

export async function updateDocumentLink(documentLink): Promise<any> {
  const queryRef = await getDocumentLinks(documentLink.path);
  if (queryRef.docs.length === 0) {
    return false;
  }
  const batch = admin.firestore().batch();
  queryRef.docs.forEach(doc => batch.set(doc.ref, documentLink));
  return batch.commit();
}

function getDocumentLinks(documentPath: string): Promise<any> {
  return admin.firestore().collection('document-links').where('path', '==', documentPath).get();
}

function updateUserProfile(filePath: string) {
  const projectId = process.env.GCLOUD_PROJECT;
  console.log('Project Id: ', projectId);
  // const projectId = 'jovisco-invoicing';
  const downloadUrl = `https://storage.googleapis.com/${projectId}.appspot.com/${filePath}`;
  const uid = filePath.split('/')[2];
  return admin.firestore().collection('user-profiles').doc(uid).update({imageUrl: downloadUrl});
}
