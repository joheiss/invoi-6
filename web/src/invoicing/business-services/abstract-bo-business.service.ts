import {Action, select, Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {OpenConfirmationDialog} from '../../app/store/actions';
import {Observable} from 'rxjs/Observable';
import {AbstractBusinessService} from './abstract-business.service';
import {Masterdata, Summary, Transaction} from 'jovisco-domain';

export abstract class AbstractBoBusinessService<T extends Transaction | Masterdata, S extends Summary> extends AbstractBusinessService<T> {

  protected constructor(protected store: Store<InvoicingState>) {
    super(store);
  }

  protected abstract buildCopySuccessEvent(data: any): Action;

  change(object: T): void {
    this.store.dispatch(this.buildChangeSuccessEvent(object.data));
  }

  copy(object: T): void {
    const data = Object.assign({}, object.data, {...this.getDefaultValues()}, {organization: this.auth.organization});
    this.store.dispatch(this.buildCopySuccessEvent(data));
  }

  create(object: T): void {
    object.header.id = this.getNextId(object);
    object.header.organization = this.auth.organization;
    object.header.isDeletable = true;
    this.store.dispatch(this.buildCreateCommand(object.data));
  }

  delete(object: T): void {
    this.store.dispatch(new OpenConfirmationDialog({
      do: this.buildDeleteCommand(object.data),
      title: this.getConfirmationQuestion(object.header.id)
    }));
  }

  protected abstract getConfirmationQuestion(id: string): string;

  getCurrent(): Observable<T> {
    return this.store.pipe(select(this.getCurrentSelector()));
  }

  protected abstract getCurrentSelector(): Function;
  protected abstract getDefaultValues(): any;
  protected abstract getIsChangeableSelector(): Function;
  protected abstract getIsDeletableSelector(): Function;
  protected abstract getNextId(object: T): string;

  getSummary(): Observable<S[]> {
    return this.store.pipe(select(this.getSummarySelector()));
  }

  protected abstract getSummarySelector(): Function;

  isChangeable(): Observable<boolean> {
    return this.store.pipe(select(this.getIsChangeableSelector()));
  }

  isDeletable(): Observable<boolean> {
    return this.store.pipe(select(this.getIsDeletableSelector()));
  }

  new(object: T): void {
    const data = Object.assign({}, this.getTemplate());
    this.store.dispatch(this.buildNewEvent(data));
  }

  update(object: T): void {
    this.store.dispatch(this.buildUpdateCommand(object.data));
  }
}
