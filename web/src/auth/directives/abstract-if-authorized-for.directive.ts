import {TemplateRef, ViewContainerRef} from '@angular/core';
import * as _ from 'lodash';
import {UserData} from 'jovisco-domain';

export abstract class AbstractIfAuthorizedForDirective {

  private isVisible = false;
  private auth: UserData;

  protected constructor(protected template: TemplateRef<any>,
                        protected container: ViewContainerRef,
                        private allowedRoles: string[]) {
  }

  protected hasRole(auth: UserData): boolean {
    return this.auth && this.auth.roles && _.intersection(this.allowedRoles, this.auth.roles).length > 0;
  }

  protected setContainer(auth: UserData) {
    const isAuthorized = this.hasRole(auth);
    if (!this.isVisible && isAuthorized) {
      this.container.createEmbeddedView(this.template);
      this.isVisible = true;
    } else if (this.isVisible && !isAuthorized) {
      this.container.clear();
      this.isVisible = false;
    }
  }
}
