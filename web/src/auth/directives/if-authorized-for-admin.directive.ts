import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AbstractIfAuthorizedForDirective} from './abstract-if-authorized-for.directive';
import {UserData} from 'jovisco-domain';

@Directive({
  selector: '[joIfAuthorizedForAdmin]'
})
export class IfAuthorizedForAdminDirective extends AbstractIfAuthorizedForDirective {

  constructor(protected template: TemplateRef<any>,
              protected container: ViewContainerRef) {
    super(template, container, ['sys-admin']);
  }

  @Input()
  set joIfAuthorizedForAdmin(auth: UserData) {
    this.setContainer(auth);
  }
}
