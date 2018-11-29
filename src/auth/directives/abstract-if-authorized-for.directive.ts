import {Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {UserData} from '../models/user';

export abstract class AbstractIfAuthorizedForDirective {

  private isVisible = false;

  protected constructor(protected template: TemplateRef<any>,
                        protected container: ViewContainerRef,
                        private allowedRole: string) { }

protected hasRole(auth: UserData): boolean {
    return auth && auth.roles && auth.roles.indexOf(this.allowedRole) >= 0;
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

  @Input()
  set joIfAuthorizedForAdmin(auth: UserData) {
    this.setContainer(auth);
  }



}
