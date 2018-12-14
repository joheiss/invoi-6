import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../app/store/reducers';
import {AbstractIfAuthorizedAsDirective} from './abstract-if-authorized-as.directive';

@Directive({
  selector: '[joIfAuthorizedAs]'
})
export class IfAuthorizedAsDirective extends AbstractIfAuthorizedAsDirective {

  constructor(protected template: TemplateRef<any>,
              protected container: ViewContainerRef,
              protected store: Store<AppState>) {
    super(template, container, store);
  }

  @Input()
  set joIfAuthorizedAs(roles: string[]) {
    this.setContainer(roles);
  }
}
