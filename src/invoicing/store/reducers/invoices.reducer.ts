import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {InvoiceData} from '../../models/invoice.model';
import * as fromInvoices from '../actions/invoices.actions';

export interface InvoiceSingle {
  isDirty: boolean;
  invoice: InvoiceData;
}
export interface InvoiceState extends EntityState<InvoiceData> {
  loaded: boolean;
  loading: boolean;
  current?: InvoiceSingle;
  error?: any;
}

export const invoiceAdapter: EntityAdapter<InvoiceData> = createEntityAdapter<InvoiceData>({
  selectId: (invoice: InvoiceData) => invoice.id,
  sortComparer: (a: InvoiceData, b: InvoiceData) => {
    const result = b.issuedAt.getTime() - a.issuedAt.getTime();
    return result ? result : a.id.localeCompare(b.id);
  }
});

const initialState: InvoiceState = invoiceAdapter.getInitialState({
  loaded: false,
  loading: false,
  current: undefined,
  error: undefined
});

export function invoiceReducer(state: InvoiceState = initialState, action: fromInvoices.InvoiceAction): InvoiceState {
  switch (action.type) {

    case fromInvoices.QUERY_INVOICES: {
      return { ...state, loading: true, loaded: false, error: undefined, current: undefined };
    }

    case fromInvoices.ADDED_INVOICE: {
      return invoiceAdapter.addOne(action.payload, {...state, loaded: true, loading: false, error: undefined });
    }

    case fromInvoices.MODIFIED_INVOICE: {
      if (action.payload.id === state.current.invoice.id) {
        const invoice = Object.assign({}, state.current.invoice, action.payload);
        const current = { isDirty: state.current.isDirty, invoice: invoice };
        return invoiceAdapter.updateOne({ id: action.payload.id, changes: action.payload },
          {...state, error: undefined , current: current });
      }
      return invoiceAdapter.updateOne({ id: action.payload.id, changes: action.payload }, {...state, error: undefined });
    }

    case fromInvoices.REMOVED_INVOICE: {
      return invoiceAdapter.removeOne(action.payload.id, state);
    }

    case fromInvoices.COPY_INVOICE_SUCCESS: {
      const current = { isDirty: true, invoice: action.payload };
      return {...state, current, error: undefined};
    }

    case fromInvoices.NEW_INVOICE_SUCCESS: {
      const current = { isDirty: true, invoice: action.payload };
      return {...state, current, error: undefined};
    }

    case fromInvoices.NEW_QUICK_INVOICE_SUCCESS: {
      const current = { isDirty: true, invoice: action.payload };
      return {...state, current, error: undefined};
    }

    case fromInvoices.SELECT_INVOICE: {
      const current = { isDirty: false, invoice: action.payload };
      return {...state, current, error: undefined};
    }

    case fromInvoices.CHANGE_INVOICE_SUCCESS: {
      const current = { isDirty: true, invoice: action.payload };
      return { ...state,  current, error: undefined };
    }

    default:
      return state;
  }
}

// state selectors
export const {
  selectIds: selectInvoiceIds,
  selectEntities: selectInvoiceEntities,
  selectAll: selectAllInvoices,
  selectTotal: selectInvoicesTotal
} = invoiceAdapter.getSelectors();

export const selectInvoicesLoading = (state: InvoiceState) => state.loading;
export const selectInvoicesLoaded = (state: InvoiceState) => state.loaded;
export const selectCurrentInvoice = (state: InvoiceState) => state.current.invoice;
export const selectInvoicesError = (state: InvoiceState) => state.error;
