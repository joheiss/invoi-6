import {TemplateRef, ViewContainerRef} from '@angular/core';
import {UserData} from '../../auth/models/user';
import * as _ from 'lodash';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../app/store/reducers';
import {selectAuth} from '../../auth/store/selectors/auth.selectors';

export abstract class AbstractIfAuthorizedAsDirective {

  private isVisible = false;
  private auth: UserData;

  protected constructor(protected template: TemplateRef<any>,
                        protected container: ViewContainerRef,
                        protected store: Store<AppState>) {
    this.setLoggedInUserFromAuth();
  }

  protected hasRole(roles: string[]): boolean {
    return this.auth && this.auth.roles && _.intersection(roles, this.auth.roles).length > 0;
  }

  protected setContainer(roles: string []) {
    const isAuthorized = this.hasRole(roles);
    if (!this.isVisible && isAuthorized) {
      this.container.createEmbeddedView(this.template);
      this.isVisible = true;
    } else if (this.isVisible && !isAuthorized) {
      this.container.clear();
      this.isVisible = false;
    }
  }

  private setLoggedInUserFromAuth(): void {
    this.store.pipe(
      select(selectAuth),
    ).subscribe(auth => this.auth = auth);
  }
}
