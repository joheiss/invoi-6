import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore} from 'angularfire2/firestore';
import {ReceiversBusinessService} from '../../invoicing/business-services';

@Component({
  selector: 'jo-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  receivers$: Observable<any>;
  contracts$: Observable<any>;
  invoices$: Observable<any>;

  constructor(private db: AngularFirestore,
              private service: ReceiversBusinessService) {
  }

  ngOnInit() {
    this.receivers$ = this.service.query();
    // this.getData();

  }

  onLoad() {
    this.loadReceivers('1234');
    // this.loadInvoices('5680');
    // this.loadContracts('4568');
  }

  onUpdate() {
    const id = '1234';
    const nameAdd = `UPDATED: ${new Date()}`;
    // this.service.update(id, { nameAdd });
  }

  private getData() {
    this.receivers$ = this.db.collection('receivers').valueChanges();
    this.contracts$ = this.db.collection('contracts').valueChanges();
    this.invoices$ = this.db.collection('invoices').valueChanges();
  }

  private loadContracts(nextDocId: string) {
    this.db.collection('contracts').doc(nextDocId).set({
      id: +nextDocId,
      issuedAt: new Date(),
      customerId: 1234,
      description: 'Projekteinzelvertrag ABC-DEF-GHI',
      startDate: new Date(2018, 0, 1),
      endDate: new Date(2018, 11, 31),
      billingMethod: 0,
      paymentTerms: '30 Tage: 3% Skonto; 60 Tage: netto',
      paymentMethod: 0,
      cashDiscountDays: 30,
      cashDiscountPercentage: 3.0,
      dueDays: 60,
      budget: 123456.78,
      currency: 'EUR',
      documentUrl: 'https://docs.jovisco.com/contracts/V4567.pdf',
      invoiceText: 'Hier steht ein Text, der auf allen Rechnungen gedruckt werden soll.',
      internalText: 'Hier steht ein Text, der nicht gedruckt werden soll.',
      items: [
        {
          id: 1,
          description: 'Arbeitszeit',
          priceUnit: 'Std.',
          pricePerUnit: 123.45,
          cashDiscountAllowed: true
        },
        {
          id: 2,
          description: 'Reisezeit',
          priceUnit: 'Std.',
          pricePerUnit: 67.89,
          cashDiscountAllowed: true
        },
        {
          id: 3,
          description: 'km-Pauschale',
          priceUnit: 'km',
          pricePerUnit: 0.12,
          cashDiscountAllowed: false
        },
        {
          id: 4,
          description: 'Übernachtungspauschale',
          priceUnit: 'Übernachtung',
          pricePerUnit: 76.54,
          cashDiscountAllowed: false
        }
      ]
    })
      .then(() => console.log('Vertrag gespeichert.'))
      .catch(err => console.log('Fehler: ', err));
  }

  private loadInvoices(nextDocId: string) {
    this.db.collection('invoices').doc(nextDocId).set({
      id: +nextDocId,
      issuedAt: new Date(),
      receiverId: 1234,
      contractId: 4567,
      status: 0,
      billingPeriod: 'Dezember 2017',
      paymentTerms: '30 Tage: 3% Skonto; 60 Tage: netto',
      paymentMethod: 0,
      cashDiscountDays: 30,
      cashDiscountPercentage: 3.0,
      dueDays: 60,
      currency: 'EUR',
      vatPercentage: 19.0,
      documentUrl: 'https://docs.jovisco.com/invoices/R5678.pdf',
      invoiceText: 'Hier steht ein Text, der auf der Rechnung gedruckt werden soll.',
      internalText: 'Hier steht ein Text, der nicht gedruckt werden soll.',
      items: [
        {
          id: 1,
          contractItemId: 1,
          description: 'Arbeitszeit',
          quantity: 234.56,
          quantityUnit: 'Std.',
          pricePerUnit: 123.45,
          cashDiscountAllowed: true,
          vatPercentage: 19.0
        },
        {
          id: 2,
          contractItemId: 2,
          description: 'Reisezeit',
          quantity: 12.34,
          quantityUnit: 'Std.',
          pricePerUnit: 67.89,
          cashDiscountAllowed: true,
          vatPercentage: 19.0
        },
        {
          id: 3,
          contractItemId: 3,
          description: 'km-Pauschale',
          quantity: 1234.56,
          quantityUnit: 'km',
          pricePerUnit: 0.12,
          cashDiscountAllowed: false,
          vatPercentage: 19.0
        },
        {
          id: 4,
          contractItemId: 4,
          description: 'Übernachtungspauschale',
          quantity: 1,
          quantityUnit: 'Übernachtung',
          pricePerUnit: 76.54,
          cashDiscountAllowed: false,
          vatPercentage: 19.0
        }
      ]
    })
      .then(() => console.log('Rechnung gespeichert.'))
      .catch(err => console.log('Fehler: ', err));
  }

  private loadReceivers(nextDocId: string) {
    this.db.collection('receivers').doc(nextDocId).set({
      id: +nextDocId,
      name: 'Adam Apfel AG',
      nameAdd: 'Apfelmost Fabrik',
      status: 0,
      address: {
        country: 'DE',
        postalCode: '76543',
        city: 'Adamsdorf',
        street: 'Apfelweg 1',
        email: 'adam.apfel@adamsapfel.de',
        phone: '+49 765 43210987',
        fax: '+49 765 43210999',
        webSite: 'http://www.adam-apfel.de'
      }
    })
      .then(() => console.log('Rechnungsempfänger gespeichert.'))
      .catch(err => console.log('Fehler: ', err));
  }
}
