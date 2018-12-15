import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {ReceiversBusinessService} from '../../business-services';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {cold} from 'jasmine-marbles';
import {mockInvoiceSummary} from '../../../test/factories/mock-invoices.factory';
import {ReceiversComponent} from './receivers.component';
import {Store} from '@ngrx/store';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../test/factories/mock-auth.factory';

describe('Receivers Component', () => {

  let component: ReceiversComponent;
  let fixture: ComponentFixture<ReceiversComponent>;
  let service: ReceiversBusinessService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [ReceiversComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ReceiversBusinessService,
          useValue: {
            change: jest.fn(),
            copy: jest.fn(),
            create: jest.fn(),
            createQuickInvoice: jest.fn(),
            delete: jest.fn(),
            getSummary: jest.fn(() => cold('-a|', { a: mockInvoiceSummary })),
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
    service = TestBed.get(ReceiversBusinessService);
    fixture = TestBed.createComponent(ReceiversComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

});
