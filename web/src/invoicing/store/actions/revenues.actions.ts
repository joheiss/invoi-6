import {Action} from '@ngrx/store';
import {RevenueData} from 'jovisco-domain';

// FIRESTORE
export const QUERY_REVENUES = '[Invoicing] Revenues query';
export const ADDED_REVENUE = '[Invoicing] Revenue added';
export const MODIFIED_REVENUE = '[Invoicing] Revenue modified';
export const REMOVED_REVENUE = '[Invoicing] Revenue removed';

export class QueryRevenues implements Action {
  readonly type = QUERY_REVENUES;
  constructor(public payload?: any) {}
}

export class AddedRevenue implements Action {
  readonly type = ADDED_REVENUE;
  constructor(public payload: RevenueData) {}
}

export class ModifiedRevenue implements Action {
  readonly type = MODIFIED_REVENUE;
  constructor(public payload: RevenueData) {}
}

export class RemovedRevenue implements Action {
  readonly type = REMOVED_REVENUE;
  constructor(public payload: RevenueData) {}
}

export type RevenueAction =
  QueryRevenues | AddedRevenue | ModifiedRevenue | RemovedRevenue;
