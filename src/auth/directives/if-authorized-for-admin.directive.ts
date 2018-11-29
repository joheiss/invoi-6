import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {UserData} from '../models/user';
import {AbstractIfAuthorizedForDirective} from './abstract-if-authorized-for.directive';

@Directive({
  selector: '[joIfAuthorizedForAdmin]'
})
export class IfAuthorizedForAdminDirective extends AbstractIfAuthorizedForDirective {

  constructor(protected template: TemplateRef<any>,
              protected container: ViewContainerRef) {
    super(template, container, 'sys-admin');
  }

  @Input()
  set joIfAuthorizedForAdmin(auth: UserData) {
    this.setContainer(auth);
  }
}
