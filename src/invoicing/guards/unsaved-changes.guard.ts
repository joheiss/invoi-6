import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs/index';
import {Injectable} from '@angular/core';
import {UiService} from '../../shared/services/ui.service';
import {map} from 'rxjs/operators';

@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<any> {
  constructor(private uiService: UiService) {
  }

  canDeactivate(component: any,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean> {
    console.log('Is form dirty?: ', component.formComponent.form.dirty);
    if (component.formComponent.form.dirty) {
      return this.uiService.openConfirmationDialog({
        title: 'Sie haben noch ungesicherte Änderungen.',
        text: 'Wollen Sie den Dialog trotzdem verlassen?'
      }).pipe(
        map(response => response.reply)
      );
    } else {
      return of(true);
    }
  }
}
