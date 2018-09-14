import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import * as fromOpenInvoices from '../actions/open-invoices.actions';
import {OpenInvoiceData} from '../../models/open-invoice.model';

export interface OpenInvoiceState extends EntityState<OpenInvoiceData> {
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const openInvoiceAdapter: EntityAdapter<OpenInvoiceData> = createEntityAdapter<OpenInvoiceData>({
  selectId: (openInvoice: OpenInvoiceData) => openInvoice.id,
  sortComparer: (a: OpenInvoiceData, b: OpenInvoiceData) => b.id.localeCompare(a.id)
});

const initialState: OpenInvoiceState = openInvoiceAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: undefined
});

export function openInvoiceReducer(state: OpenInvoiceState = initialState, action: fromOpenInvoices.OpenInvoiceAction): OpenInvoiceState {
  switch (action.type) {

    case fromOpenInvoices.QUERY_OPEN_INVOICES: {
      return { ...state, loading: true, loaded: false, error: undefined };
    }

    case fromOpenInvoices.ADDED_OPEN_INVOICE: {
      return openInvoiceAdapter.addOne(action.payload, {...state, loaded: true, loading: false, error: undefined });
    }

    case fromOpenInvoices.MODIFIED_OPEN_INVOICE: {
      return openInvoiceAdapter.updateOne({ id: action.payload.id, changes: action.payload }, {...state, error: undefined });
    }

    case fromOpenInvoices.REMOVED_OPEN_INVOICE: {
      return openInvoiceAdapter.removeOne(action.payload.id, state);
    }

    default:
      return state;
  }
}

// state selectors
export const {
  selectIds: selectOpenInvoiceIds,
  selectEntities: selectOpenInvoiceEntities,
  selectAll: selectAllOpenInvoices,
  selectTotal: selectOpenInvoiceTotal } = openInvoiceAdapter.getSelectors();

export const selectOpenInvoicesLoading = (state: OpenInvoiceState) => state.loading;
export const selectOpenInvoicesLoaded = (state: OpenInvoiceState) => state.loaded;
export const selectOpenInvoicesError = (state: OpenInvoiceState) => state.error;


