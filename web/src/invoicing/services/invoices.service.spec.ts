import {TestBed} from '@angular/core/testing';
import {FbStoreService} from '../../shared/services/fb-store.service';
import {InvoicesService} from './invoices.service';
import {FbFunctionsService} from '../../shared/services/fb-functions.service';
import {mockSingleInvoice} from '../../test/factories/mock-invoices.factory';
import {InvoiceData} from 'jovisco-domain';

describe('Invoices Service', () => {
  let service: InvoicesService;
  let persistence: FbStoreService;
  let cloudFunctions: FbFunctionsService;
  let invoice: InvoiceData;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FbStoreService,
          useValue: {
           assignCollection: jest.fn()
          }
        },
        {
          provide: FbFunctionsService,
          useValue: {
            createInvoicePDF: jest.fn(),
            sendInvoiceEmail: jest.fn()
          }
        },
        InvoicesService
      ]
    });

    persistence = TestBed.inject(FbStoreService);
    cloudFunctions = TestBed.inject(FbFunctionsService);
    service = TestBed.inject(InvoicesService);
  });

  beforeEach(() => {
    invoice = mockSingleInvoice();
  });

  it('should create the service', async () => {
    expect(service).toBeDefined();
  });

  it('should invoke create PDF function', () => {
    const spy = jest.spyOn(cloudFunctions, 'createInvoicePDF');
    service.createInvoicePDF(invoice);
    expect(spy).toHaveBeenCalledWith(invoice);
  });

  it('should invoke send email function', () => {
    const spy = jest.spyOn(cloudFunctions, 'sendInvoiceEmail');
    service.sendInvoiceEmail(invoice);
    expect(spy).toHaveBeenCalledWith(invoice);
  });
});
