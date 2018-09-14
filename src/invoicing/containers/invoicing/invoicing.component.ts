import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
  selector: 'jo-invoicing',
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicingComponent {

  constructor(private store: Store<fromStore.InvoicingState>) {}

}
