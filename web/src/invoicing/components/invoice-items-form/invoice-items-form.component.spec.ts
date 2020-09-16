import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormArray, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {InvoiceItemsFormComponent} from '..';
import {By} from '@angular/platform-browser';
import {InvoicesBusinessService} from '../../business-services';
import {mockSingleInvoice} from '../../../test/factories/mock-invoices.factory';
import {Store} from '@ngrx/store';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {InvoiceFactory} from 'jovisco-domain';

describe('Invoice Items Form Component', () => {

  let component: InvoiceItemsFormComponent;
  let fixture: ComponentFixture<InvoiceItemsFormComponent>;
  let service: InvoicesBusinessService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [InvoiceItemsFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: InvoicesBusinessService,
          useValue: {
            addItem: jest.fn()
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
    service = TestBed.get(InvoicesBusinessService);
    fixture = TestBed.createComponent(InvoiceItemsFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.itemsFormArray = new FormArray([]);
      component.object = InvoiceFactory.fromData(mockSingleInvoice());
      component.isChangeable = true;
      component.ngOnChanges({});
    });

    it('should provide the items to the form array', async () => {
      expect(component.itemsFormArray).toHaveLength(1);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.itemsFormArray = new FormArray([]);
      component.object = InvoiceFactory.fromData(mockSingleInvoice());
      component.isChangeable = true;
      component.ngOnChanges({});
      fixture.detectChanges();
    });

    it('should show the add button if invoice is changeable', async () => {
      const btn = fixture.debugElement.query(By.css('button'));
      expect(btn).toBeTruthy();
    });

    it('should invoke onAdd if add button is pressed', async () => {
      const spy = jest.spyOn(component, 'onAdd');
      const btn = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLButtonElement;
      btn.click();
      return expect(spy).toHaveBeenCalled();
    });
  });
});



