#!/usr/bin/env node

import * as admin from 'firebase-admin';
import * as args from 'commander';
import {Invoice, InvoiceData, InvoiceFactory, RevenueData, RevenueExtractData} from 'jovisco-domain';
import {getReceiver} from '../../shared/src';

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
    .map(doc => mapToInvoice(doc.data()))
    .filter(invoice => invoice.revenuePeriod.year > lockedDownYear)
    .map(invoice => mapRevenue(invoice))
    .reduce((revenues: RevenueData[], extract: RevenueExtractData) => reduceRevenues(revenues, extract), []);
}

async function buildOpenInvoices(allInvoices: any): Promise<any> {
  return Promise.all(
    allInvoices.docs
      .map(doc => mapToInvoice(doc.data()))
      .filter(invoice => invoice.isOpen())
      .map(async invoice => await mapOpenInvoice(invoice))
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

async function mapOpenInvoice(invoice: Invoice): Promise<any> {
  const receiver = await getReceiver(db, invoice.header.receiverId);
  const receiverName = receiver.name;
  return {
    id: invoice.header.id,
    organization: invoice.header.organization,
    issuedAt: invoice.header.issuedAt,
    status: invoice.header.status,
    receiverId: invoice.header.receiverId,
    receiverName: receiverName,
    billingPeriod: invoice.header.billingPeriod,
    netValue: invoice.netValue,
    paymentAmount: invoice.paymentAmount,
    dueDate: invoice.dueDate
  };
}

function mapRevenue(invoice: Invoice): RevenueExtractData {
  return {
    year: invoice.revenuePeriod.year.toString(),
    organization: invoice.header.organization,
    month: invoice.revenuePeriod.month.toString(),
    receiverId: invoice.header.receiverId,
    netValue: invoice.netValue
  };
}

function mapToInvoice(data: InvoiceData): Invoice {
  const invoiceData = {...data};
  return InvoiceFactory.fromData(invoiceData);
}

function reduceRevenues(revenues: RevenueData[], extract: RevenueExtractData) {
  const {year, organization, month, receiverId, netValue} = extract;
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

