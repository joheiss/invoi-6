import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {InvoicingComponent} from './invoicing.component';
import {Store} from '@ngrx/store';
import {InvoicingState} from '../../store';

describe('Invoicing Component', () => {

  let component: InvoicingComponent;
  let fixture: ComponentFixture<InvoicingComponent>;
  let store: Store<InvoicingState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [InvoicingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(InvoicingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

});
