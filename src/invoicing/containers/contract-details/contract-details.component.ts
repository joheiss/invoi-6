import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs/index';
import {Contract} from '../../models/contract.model';
import {Receiver} from '../../models/receiver.model';
import {Invoice} from '../../models/invoice.model';
import {ActivatedRoute} from '@angular/router';
import {ContractsBusinessService} from '../../business-services';
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

  protected getTitle(object: Contract): string {
    return object.header.id ? `${object.header.id} - ${object.header.description }` : `[neu]`;
  }

  protected initializeWithData(param: string) {
    this.receivers$ = this.service.getReceivers();
    this.contractPartner$ = this.service.getPartner();
    console.log('PARAM: ', param);
    if (param === 'copy' || param === 'new') {
      this.task = param;
      this.contract$ = this.service.getCurrent();
      this.isChangeable$ = of(true);
    } else {
      this.task = 'edit';
      this.contract$ = this.service.getCurrent();
      this.openInvoices$ = this.service.getOpenInvoices();
      this.allInvoices$ = this.service.getInvoices();
      this.isChangeable$ = this.service.isChangeable();
    }
  }
}
