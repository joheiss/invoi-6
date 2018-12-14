#!/usr/bin/env node

import * as admin from 'firebase-admin';
import * as args from 'commander';

const serviceAccount = require('../../../credentials-prod.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// get command line arguments
args
  .version('0.0.1')
  .option('-t, --test <flag>', 'Run in test mode - without updates to database')
  .parse(process.argv);

const testMode = !!args.test;

listAllUsers();

// refresh reporting collections
function listAllUsers() {
    admin.auth().listUsers(100)
      .then(res => res.users.forEach(u => console.log('User: ', u.toJSON())))
      .catch(err => console.error('Error listing users: ', err));
}


