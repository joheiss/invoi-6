import {Action} from '@ngrx/store';
import {NumberRangeData} from '../../models/number-range.model';

// FIRESTORE
export const QUERY_NUMBER_RANGES = '[Invoicing] Number Ranges query';
export const ADDED_NUMBER_RANGE = '[Invoicing] Number Range added';
export const MODIFIED_NUMBER_RANGE = '[Invoicing] Number Range modified';
export const REMOVED_NUMBER_RANGE = '[Invoicing] Number Range removed';
export const UPDATE_NUMBER_RANGE = '[Invoicing] Number Range update';
export const UPDATE_NUMBER_RANGE_SUCCESS = '[Invoicing] Number Range update success';

export class QueryNumberRanges implements Action {
  readonly type = QUERY_NUMBER_RANGES;
  constructor() {}
}

export class AddedNumberRange implements Action {
  readonly type = ADDED_NUMBER_RANGE;
  constructor(public payload: NumberRangeData) {}
}

export class ModifiedNumberRange implements Action {
  readonly type = MODIFIED_NUMBER_RANGE;
  constructor(public payload: NumberRangeData) {}
}

export class RemovedNumberRange implements Action {
  readonly type = REMOVED_NUMBER_RANGE;
  constructor(public payload: NumberRangeData) {}
}

export class UpdateNumberRange implements Action {
  readonly type = UPDATE_NUMBER_RANGE;
  constructor(public id: string, public changes: Partial<NumberRangeData>) {}
}

export class UpdateNumberRangeSuccess implements Action {
  readonly type = UPDATE_NUMBER_RANGE_SUCCESS;
  constructor() {}
}

export type NumberRangeAction =
  QueryNumberRanges | AddedNumberRange | ModifiedNumberRange | RemovedNumberRange |
  UpdateNumberRange | UpdateNumberRangeSuccess;


