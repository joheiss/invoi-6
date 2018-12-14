import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {UserData} from '../models/user';
import {AbstractIfAuthorizedForDirective} from './abstract-if-authorized-for.directive';

@Directive({
  selector: '[joIfAuthorizedForSalesEdit]'
})
export class IfAuthorizedForSalesEditDirective extends AbstractIfAuthorizedForDirective {

  constructor(protected template: TemplateRef<any>,
              protected container: ViewContainerRef) {
    super(template, container, ['sales-user']);
  }

  @Input()
  set joIfAuthorizedForSalesEdit(auth: UserData) {
    this.setContainer(auth);
  }
}
