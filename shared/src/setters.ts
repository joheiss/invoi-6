export async function updateInvoice(db: any, id: string, payload: any): Promise<any> {
  return db.collection('invoices').doc(id).update(payload);
}

export async function setRevenues(db: any, revenues: any): Promise<any> {
  const $id = `${revenues.id}_${revenues.organization}`;
  return db.collection('revenues').doc($id).set(revenues);
}
