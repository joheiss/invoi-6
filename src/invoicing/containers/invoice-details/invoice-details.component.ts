import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Contract} from '../../models/contract.model';
import {Receiver} from '../../models/receiver.model';
import {Invoice} from '../../models/invoice.model';
import {Observable, of} from 'rxjs/index';
import {ActivatedRoute} from '@angular/router';
import {InvoicesBusinessService} from '../../business-services';
import {DetailsComponent} from '../../abstracts/details.component';


@Component({
  selector: 'jo-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetailsComponent extends DetailsComponent<Invoice> implements OnInit {
  invoice$: Observable<Invoice>;
  invoiceReceiver$: Observable<Receiver>;
  invoiceContract$: Observable<Contract>;
  receivers$: Observable<Receiver[]>;
  contracts$: Observable<Contract[]>;
  isChangeable$: Observable<boolean>;
  isSendable$: Observable<boolean>;

  mode: string;

  constructor(protected service: InvoicesBusinessService,
              protected route: ActivatedRoute) {
    super(service, route);
  }

  onCreatePdf(invoice: Invoice) {
    this.service.createPdf(invoice);
  }

  onSendEmail(invoice: Invoice) {
    console.log('invoke send email service for: ', invoice.header.id);
    this.service.sendEmail(invoice);
  }

  protected getTitle(object: Invoice): string {
    const docName = object.header.billingMethod === 0 ? 'Rechnung' : 'Gutschriftsanforderung';
    return object.header.id ? `${docName} ${object.header.id} - ${object.header.billingPeriod}` : `${docName} [neu]`;
  }

  protected initializeWithData(param: string) {
    this.invoice$ = this.service.getCurrent();
    this.invoiceReceiver$ = this.service.getReceiver();
    this.invoiceContract$ = this.service.getContract();
    this.receivers$ = this.service.getReceivers();
    this.contracts$ = this.service.getContracts();
    this.mode = 'edit';
    if (param === 'copy' || param === 'new') {
      this.task$.next(param);
      this.isChangeable$ = of(true);
    } else if (param === 'quick') {
      this.task$.next(param);
    } else {
      this.task$.next('edit');
      this.isChangeable$ = this.service.isChangeable();
      this.isSendable$ = this.service.isSendable();
    }
  }

}
