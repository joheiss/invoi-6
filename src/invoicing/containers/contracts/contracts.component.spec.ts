import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {ContractsBusinessService} from '../../business-services';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {cold} from 'jasmine-marbles';
import {ContractsComponent} from './contracts.component';
import {mockReceiverSummary} from '../../../test/factories/mock-receivers.factory';
import {mockContractSummary} from '../../../test/factories/mock-contracts.factory';
import {Store} from '@ngrx/store';
import {of} from 'rxjs/internal/observable/of';
import {mockAuth} from '../../../test/factories/mock-auth.factory';

describe('Contracts Component', () => {

  let component: ContractsComponent;
  let fixture: ComponentFixture<ContractsComponent>;
  let service: ContractsBusinessService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [ContractsComponent],
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
            getSummary: jest.fn(() => cold('-a|', { a: mockContractSummary })),
            new: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: cold('-a|', {a: {get: () => '4909'}})
          }
        },
        {
          provide: Store,
          useValue: {
            pipe: jest.fn(() => of(mockAuth()[0])),
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.get(ContractsBusinessService);
    fixture = TestBed.createComponent(ContractsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

});
