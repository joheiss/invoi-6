#!/usr/bin/env node

import * as admin from 'firebase-admin';
import * as args from 'commander';
import {calcDueDate, calcNetValue, calcPaymentAmount, calcRevenuePeriod} from '../../shared/src/calculations';
import {getReceiver} from '../../shared/src/getters';
import * as moment from 'moment';
import {firestore} from 'firebase';
import {RevenueData, RevenueExtract} from '../../shared/src/models';

// const serviceAccount = require('../../../credentials-prod.json');
const serviceAccount = require('../../../credentials.json');

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
const today = new Date();
const lockedDownYear = today.getFullYear() - 1;
console.log('Locked Down Year: ', lockedDownYear);

refreshReporting();

// refresh reporting collections
async function refreshReporting() {
  try {
    const invoicesCol = db.collection('invoices');
    const allInvoices = await invoicesCol.get();
    // prepare revenues
    const revenues = buildRevenues(allInvoices);
    await updateRevenues(revenues);
    // prepare open invoices
    const openInvoices = await buildOpenInvoices(allInvoices);
    await deleteOpenInvoices();
    await insertOpenInvoices(openInvoices);
  } catch (error) {
    console.error(error);
  }
}

function buildRevenues(allInvoices: any): RevenueData[] {
  return allInvoices.docs
    .filter(doc => calcRevenuePeriod(moment(doc.data().issuedAt)).year > lockedDownYear)
    .map(doc => mapRevenue(doc))
    .reduce((revenues: RevenueData[], extract: RevenueExtract) => reduceRevenues(revenues, extract), []);
}

async function buildOpenInvoices(allInvoices: any): Promise<any> {
  return Promise.all(
    allInvoices.docs
    .filter(doc => doc.data().status !== 2)
    .map(async doc => await mapOpenInvoice(doc.data()))
  );
}

async function deleteOpenInvoices(): Promise<any> {
  const batch = admin.firestore().batch();
  const allOpenInvoices = await admin.firestore().collection('open-invoices').get();
  allOpenInvoices.forEach(openInvoice => batch.delete(openInvoice.ref));
  return batch.commit();
}

function insertOpenInvoices(openInvoices: any[]): Promise<any> {
  const batch = admin.firestore().batch();
  openInvoices.forEach(openInvoice => {
    const ref = db.collection('open-invoices').doc(openInvoice.id);
    batch.set(ref, openInvoice);
  });
  return batch.commit();
}

async function mapOpenInvoice(invoice: any): Promise<any> {
  const receiver = await getReceiver(db, invoice.receiverId);
  const receiverName = receiver.name;
  return {
    id: invoice.id,
    organization: invoice.organization,
    issuedAt: invoice.issuedAt,
    status: invoice.status,
    receiverId: invoice.receiverId,
    receiverName: receiverName,
    billingPeriod: invoice.billingPeriod,
    netValue: calcNetValue(invoice),
    paymentAmount: calcPaymentAmount(invoice),
    dueDate: calcDueDate(invoice)
  };
}

function mapRevenue(doc: firestore.DocumentSnapshot): RevenueExtract {
  const period = calcRevenuePeriod(moment(doc.data().issuedAt));
  return {
    year: period.year.toString(),
    organization: doc.data().organization,
    month: period.month.toString(),
    receiverId: doc.data().receiverId,
    netValue: calcNetValue(doc.data())
  };
}

function reduceRevenues(revenues: RevenueData[], extract: RevenueExtract) {
  const { year, organization, month, receiverId, netValue } = extract;
  let revYear = revenues.find(rev => rev.id === year && rev.organization === organization);
  if (revYear) {
    const revMonth = revYear.months[month];
    if (revMonth) {
      revMonth[receiverId] ?
        revMonth[receiverId] += netValue :
        revMonth[receiverId] = netValue;
    } else {
      revYear.months[month] = {[receiverId]: netValue};
    }
  } else {
    revYear = {
      id: year,
      organization: organization,
      months: {[month]: {[receiverId]: netValue}}
    };
    revenues.push(revYear);
  }
  return revenues;
}

function updateRevenues(revenues: any[]): Promise<any> {
  const batch = admin.firestore().batch();
  revenues.forEach(revenue => {
    const revenueId = `${revenue.id}_${revenue.organization}`;
    const ref = db.collection('revenues').doc(revenueId);
    batch.set(ref, revenue);
  });
  return batch.commit();
}

