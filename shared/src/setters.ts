export async function updateInvoice(db: any, id: string, payload: any): Promise<any> {
  return db.collection('invoices').doc(id).update(payload);
}
