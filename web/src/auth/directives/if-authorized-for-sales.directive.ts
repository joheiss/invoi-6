import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AbstractIfAuthorizedForDirective} from './abstract-if-authorized-for.directive';
import {UserData} from 'jovisco-domain';

@Directive({
  selector: '[joIfAuthorizedForSales]'
})
export class IfAuthorizedForSalesDirective extends AbstractIfAuthorizedForDirective {

  constructor(protected template: TemplateRef<any>,
              protected container: ViewContainerRef) {
    super(template, container, ['sales-user', 'auditor']);
  }

  @Input()
  set joIfAuthorizedForSales(auth: UserData) {
    this.setContainer(auth);
  }
}
