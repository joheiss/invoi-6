export async function getInvoice(db: any, id: string): Promise<any> {
  const invoiceDoc = await db.collection('invoices').doc(id).get();
  return invoiceDoc ? invoiceDoc.data() : null;
}

export async function getReceiver(db: any, id: string): Promise<any> {
  const receiverDoc = await db.collection('receivers').doc(id).get();
  return receiverDoc ? receiverDoc.data() : null;
}

export async function getRevenues(db: any, $id: string): Promise<any> {
  const revenuesDoc = await db.collection('revenues').doc($id).get();
  return revenuesDoc ? revenuesDoc.data() : null;
}

export async function getDocLinksForBusinessObject(db: any, object: any): Promise<any> {
  const owner = `${object.objectType}/${object.id}`;
  return await db.collection('document-links').where('owner', '==', owner).get();
}
