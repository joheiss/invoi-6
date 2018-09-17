import {NumberRangesEffects} from './number-ranges.effects';
import {ReceiversEffects} from './receivers.effects';
import {ContractsEffects} from './contract.effects';
import {InvoicesEffects} from './invoices.effects';
import {SettingsEffects} from './settings.effects';
import {DocumentLinksEffects} from './document-links.effects';

export const effects: any[] = [
  NumberRangesEffects,
  ReceiversEffects,
  ContractsEffects,
  InvoicesEffects,
  SettingsEffects,
  DocumentLinksEffects
];

export * from './number-ranges.effects';
export * from './receivers.effects';
export * from './contract.effects';
export * from './invoices.effects';
export * from './settings.effects';
export * from './document-links.effects';

