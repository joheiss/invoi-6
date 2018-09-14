import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Receiver} from '../../models/receiver.model';
import {Contract} from '../../models/contract.model';
import {ActivatedRoute} from '@angular/router';
import {Invoice} from '../../models/invoice.model';
import {ReceiversBusinessService} from '../../business-services/receivers-business.service';
import {DetailsComponent} from '../../abstracts/details.component';
import {Country} from '../../models/country';

@Component({
  selector: 'jo-receiver-details',
  templateUrl: './receiver-details.component.html',
  styleUrls: ['./receiver-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiverDetailsComponent extends DetailsComponent<Receiver> implements OnInit {
  receiver$: Observable<Receiver>;
  activeContractsForReceiver$: Observable<Contract[]>;
  lastContractsForReceiver$: Observable<Contract[]>;
  openInvoicesForReceiver$: Observable<Invoice[]>;
  lastInvoicesForReceiver$: Observable<Invoice[]>;
  isDeletable$: Observable<boolean>;
  isQualifiedForQuickInvoice$: Observable<boolean>;
  countries$: Observable<Country[]>;

  constructor(protected service: ReceiversBusinessService,
              protected route: ActivatedRoute) {
    super(service, route);
  }

  onQuickInvoice(receiver: Receiver) {
    this.service.createQuickInvoice(receiver);
  }

  protected getTitle(object: Receiver): string {
    return object.header.id ? `${object.header.id} - ${object.header.name}` : `[neu]`;
  }

  protected initializeWithData(param: string): void {
    this.countries$ = this.service.getCountries();
    if (param === 'copy' || param === 'new') {
      this.task = param;
      this.receiver$ = this.service.getCurrent();
    } else {
      this.task = 'edit';
      this.receiver$ = this.service.getCurrent();
      this.activeContractsForReceiver$ = this.service.getActiveContracts();
      this.lastContractsForReceiver$ = this.service.getRecentContracts();
      this.openInvoicesForReceiver$ = this.service.getOpenInvoices();
      this.lastInvoicesForReceiver$ = this.service.getOpenInvoices();
      this.isDeletable$ = this.service.isDeletable();
      this.isQualifiedForQuickInvoice$ = this.service.isQualifiedForQuickInvoice();
    }
  }
}