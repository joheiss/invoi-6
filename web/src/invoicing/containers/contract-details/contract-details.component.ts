import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs/index';
import {ActivatedRoute} from '@angular/router';
import {ContractsBusinessService} from '../../business-services';
import {Contract, Invoice, Receiver} from 'jovisco-domain';
import {DetailsComponent} from '../../abstracts/details.component';

@Component({
  selector: 'jo-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractDetailsComponent extends DetailsComponent<Contract> implements OnInit {
  contract$: Observable<Contract>;
  contractPartner$: Observable<Receiver>;
  openInvoices$: Observable<Invoice[]>;
  allInvoices$: Observable<Invoice[]>;
  receivers$: Observable<Receiver[]>;
  isChangeable$: Observable<boolean>;

  constructor(protected service: ContractsBusinessService,
              protected route: ActivatedRoute) {
    super(service, route);
  }

  onQuickInvoice(contract: Contract) {
    this.service.createQuickInvoice(contract);
  }

 getTitle(object: Contract): string {
    return object.header.id ? `${object.header.id} - ${object.header.description }` : `[neu]`;
  }

  protected initializeWithData(param: string) {
    this.receivers$ = this.service.getReceivers();
    this.contractPartner$ = this.service.getPartner();

    if (param === 'copy' || param === 'new') {
      this.task$.next(param);
      this.contract$ = this.service.getCurrent();
      this.isChangeable$ = of(true);
    } else {
      this.task$.next('edit');
      this.contract$ = this.service.getCurrent();
      this.openInvoices$ = this.service.getOpenInvoices();
      this.allInvoices$ = this.service.getInvoices();
      this.isChangeable$ = this.service.isDeletable();
    }
  }
}
