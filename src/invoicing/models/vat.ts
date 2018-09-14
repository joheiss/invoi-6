export const VAT_TASK_EDIT = 'edit';
export const VAT_TASK_NEW_TAXCODE = 'new';
export const VAT_TASK_NEW_PERIOD = 'period';

export type VatTask = 'edit' | 'new' | 'period';

export interface Vat {
  taxCode: string;
  validFrom: Date;
  validTo: Date;
  percentage: number;
}

