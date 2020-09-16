import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/index';
import {ActivatedRoute} from '@angular/router';
import {ReceiversBusinessService} from '../../business-services';
import {DetailsComponent} from '../../abstracts/details.component';
import {Receiver, Contract, Invoice, CountryData} from 'jovisco-domain';

@Component({
  selector: 'jo-receiver-details',
  templateUrl: './receiver-details.component.html',
  styleUrls: ['./receiver-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiverDetailsComponent extends DetailsComponent<Receiver> implements OnInit, AfterViewInit {
  receiver$: Observable<Receiver>;
  activeContractsForReceiver$: Observable<Contract[]>;
  lastContractsForReceiver$: Observable<Contract[]>;
  openInvoicesForReceiver$: Observable<Invoice[]>;
  lastInvoicesForReceiver$: Observable<Invoice[]>;
  isDeletable$: Observable<boolean>;
  isQualifiedForQuickInvoice$: Observable<boolean>;
  countries$: Observable<CountryData[]>;

  constructor(protected service: ReceiversBusinessService,
              protected route: ActivatedRoute) {
    super(service, route);
  }

  onQuickInvoice(receiver: Receiver) {
    this.service.createQuickInvoice(receiver);
  }

  getTitle(object: Receiver): string {
    return object.header.id ? `${object.header.id} - ${object.header.name}` : `[neu]`;
  }

  protected initializeWithData(param: string): void {
    this.countries$ = this.service.getCountries();
    if (param === 'copy' || param === 'new') {
      this.task$.next(param);
      this.receiver$ = this.service.getCurrent();
    } else {
      this.task$.next('edit');
      this.receiver$ = this.service.getCurrent();
      this.activeContractsForReceiver$ = this.service.getActiveContracts();
      this.lastContractsForReceiver$ = this.service.getRecentContracts();
      this.openInvoicesForReceiver$ = this.service.getOpenInvoices();
      this.lastInvoicesForReceiver$ = this.service.getLastInvoices();
      this.isDeletable$ = this.service.isDeletable();
      this.isQualifiedForQuickInvoice$ = this.service.isQualifiedForQuickInvoice();
    }
  }
}
