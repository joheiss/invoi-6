#!/usr/bin/env node

import * as admin from 'firebase-admin';
import * as args from 'commander';
import * as fs from 'fs';
import * as util from 'util';

const serviceAccount = require('../../../credentials-prod.json');
// const serviceAccount = require('../../../credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// get command line arguments
args
  .version('0.0.1')
  .option('-o, --output <flag>', 'Run in test mode - without updates to database')
  .parse(process.argv);

const testMode = !!args.test;
const dirName = args.dirName;

exportToFile();

async function exportToFile() {
  const collectionNames = ['number-ranges', 'settings', 'contracts', 'receivers', 'invoices', 'revenues'];
  const writeToFile = util.promisify(fs.writeFile);
  try {
    collectionNames.forEach(async colName => {
      const data = await getContent(colName);
      await writeToFile(`${__dirname}/../../../exports/${colName}.json`, JSON.stringify(data, null, 4), 'utf-8');
    });
  } catch (error) {
    console.error(error);
  }
}
// refresh reporting collections
async function getContent(colName: string) {
  try {
    const allDocs = await db.collection(colName).get();
    return allDocs.docs.map(doc => doc.data());
  } catch (error) {
    console.error(error);
  }
}
