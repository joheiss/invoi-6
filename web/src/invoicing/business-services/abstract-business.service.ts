import {Action, select, Store} from '@ngrx/store';
import {InvoicingState} from '../store/reducers';
import {selectAuth} from '../../auth/store/selectors';
import {UserData} from 'jovisco-domain';

export abstract class AbstractBusinessService<T> {

  protected auth: UserData;

  protected constructor(protected store: Store<InvoicingState>) {

    this.setLoggedInUserFromAuth();
  }

  protected abstract buildChangeSuccessEvent(data: any): Action;
  protected abstract buildCreateCommand(data: any): Action;
  protected abstract buildDeleteCommand(data: any): Action;
  protected abstract buildNewEvent(data: any): Action;
  protected abstract buildUpdateCommand(data: any): Action;

  change(object: T): void {
    this.store.dispatch(this.buildChangeSuccessEvent(object));
  }

  create(object: T): void {
    this.store.dispatch(this.buildCreateCommand(object));
  }

  delete(object: T): void {
    this.store.dispatch(this.buildDeleteCommand(object));
  }

  protected abstract getTemplate(): any;

  isUserAllowedToEdit(): boolean {
    return this.auth && this.auth.roles && this.auth.roles.indexOf('sales-user') >= 0;
  }

  new(object: T): void {
    const data = Object.assign({}, this.getTemplate());
    this.store.dispatch(this.buildNewEvent(data));
  }

  update(object: T): void {
    this.store.dispatch(this.buildUpdateCommand(object));
  }

  private setLoggedInUserFromAuth(): void {
    this.store.pipe(
      select(selectAuth),
    ).subscribe(auth => this.auth = auth);
  }
}
