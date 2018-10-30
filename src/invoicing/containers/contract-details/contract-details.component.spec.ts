import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {ContractDetailsComponent} from './contract-details.component';
import {ContractsBusinessService} from '../../business-services';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {cold} from 'jasmine-marbles';
import {mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {Contract} from '../../models/contract.model';
import {mockAllReceivers, mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {Receiver} from '../../models/receiver.model';
import {mockAllInvoices} from '../../../test/factories/mock-invoices.factory';
import {Invoice} from '../../models/invoice.model';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs/index';

describe('Contract Details Component', () => {

  let component: ContractDetailsComponent;
  let fixture: ComponentFixture<ContractDetailsComponent>;
  let service: ContractsBusinessService;
  let route: ActivatedRoute;
  let contract: Contract;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [ContractDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ContractsBusinessService,
          useValue: {
            change: jest.fn(),
            copy: jest.fn(),
            create: jest.fn(),
            createQuickInvoice: jest.fn(),
            delete: jest.fn(),
            getCurrent: jest.fn(() => cold('-a|', { a: Contract.createFromData(mockSingleContract()) })),
            getInvoices: jest.fn(() => {
              const contract = mockSingleContract();
              const allInvoices = mockAllInvoices()
                .filter(i => i.contractId === contract.id)
                .map(i => Invoice.createFromData(i));
              return cold('-a|', { a: allInvoices });
            }),
            getOpenInvoices: jest.fn(() => {
              const contract = mockSingleContract();
              const openInvoices = mockAllInvoices()
                .filter(i => i.contractId === contract.id)
                .map(i => Invoice.createFromData(i))
                .slice(0, 2);
              return cold('-a|', { a: openInvoices });
            }),
            getPartner: jest.fn(() => cold('-a|', { a: Receiver.createFromData(mockSingleReceiver()) })),
            getReceivers: jest.fn(() => cold('-a|', { a: mockAllReceivers().map(r => Receiver.createFromData(r)) })),
            isDeletable: jest.fn(() => cold('-a|', { a: true })),
            new: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: cold('-a|', {a: {get: () => '4909'}})
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.get(ContractsBusinessService);
    route = TestBed.get(ActivatedRoute);
    fixture = TestBed.createComponent(ContractDetailsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    component.contract$ = of(Contract.createFromData((mockSingleContract())));
    fixture.detectChanges();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      contract = Contract.createFromData(mockSingleContract());
    });

    it('should invoke service.createQuickInvoice if quick invoice is requested', () => {
      const spy = jest.spyOn(service, 'createQuickInvoice');
      component.onQuickInvoice(contract);
      expect(spy).toHaveBeenCalledWith(contract);
    });

    it('should return the correct title', () => {
      expect(component['getTitle'](contract)).toContain(contract.header.id);
      expect(component['getTitle'](contract)).toContain(contract.header.description);
    });

    it('should initialize receivers and contract partner in any case', () => {
      component['initializeWithData']('something');
      fixture.detectChanges();
      let expected: any = cold('-a|', { a: mockAllReceivers().map(r => Receiver.createFromData(r)) });
      expect(component.receivers$).toBeObservable(expected);
      expected = cold('---a|', { a: Receiver.createFromData(mockSingleReceiver()) });
      expect(component.contractPartner$).toBeObservable(expected);
    });

    it('should initialize contract, changeability and task in any case of new or copy', () => {
      component['initializeWithData']('new');
      fixture.detectChanges();
      let expected: any = cold('-a|', { a: Contract.createFromData(mockSingleContract()) });
      expect(component.contract$).toBeObservable(expected);
      expected = cold('---a|', { a: true });
      expect(component.isChangeable$).toBeObservable(expected);
    });

    it('should additionally initialize open and all invoices in case of edit', () => {
      component['initializeWithData']('edit');
      fixture.detectChanges();
      let expected: any = cold('-a|', { a: Contract.createFromData(mockSingleContract()) });
      expect(component.contract$).toBeObservable(expected);
      expected = cold('---a|', { a: true });
      expect(component.isChangeable$).toBeObservable(expected);
      expected = cold('-----a|', { a: true });
      expect(component.isChangeable$).toBeObservable(expected);
      expect(component.openInvoices$).toBeTruthy();
      expect(component.allInvoices$).toBeTruthy();
    });
  });

  describe('View', () => {

    it('should embed the contract form', async () => {
      const de = fixture.debugElement.query(By.css('jo-contract-form'));
      expect(de).toBeTruthy();
    });
  });

});
