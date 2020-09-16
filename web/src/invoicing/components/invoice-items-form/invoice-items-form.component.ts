import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {InvoicesBusinessService} from '../../business-services';
import {DetailsItemsFormComponent} from '../../abstracts/details-items-form.component';
import {Contract, Invoice} from 'jovisco-domain';

@Component({
  selector: 'jo-invoice-items-form',
  templateUrl: './invoice-items-form.component.html',
  styleUrls: ['./invoice-items-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceItemsFormComponent extends DetailsItemsFormComponent<Invoice> implements OnChanges {
  @Input() contract: Contract;

  constructor(protected service: InvoicesBusinessService) {
    super(service);
  }
}
