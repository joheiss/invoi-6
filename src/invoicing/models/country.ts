export const COUNTRY_TASK_EDIT = 'edit';
export const COUNTRY_TASK_NEW_COUNTRY = 'new';
export const COUNTRY_TASK_NEW_TRANSLATION = 'translate';

export type CountryTask = 'edit' | 'new' | 'translate';

export type CountryNames = { [key: string]: string };

export interface Country {
  isoCode: string;
  names: Object;
}
