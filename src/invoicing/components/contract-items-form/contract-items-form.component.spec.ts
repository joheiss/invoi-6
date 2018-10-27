import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormArray, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {Contract} from '../../models/contract.model';
import {mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {ContractItemsFormComponent} from '..';
import {By} from '@angular/platform-browser';
import {ContractsBusinessService} from '../../business-services';

describe('Contract Items Form Component', () => {

  let component: ContractItemsFormComponent;
  let fixture: ComponentFixture<ContractItemsFormComponent>;
  let service: ContractsBusinessService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [ContractItemsFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ContractsBusinessService,
          useValue: {
            addItem: jest.fn()
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.get(ContractsBusinessService);
    fixture = TestBed.createComponent(ContractItemsFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.itemsFormArray = new FormArray([]);
      component.object = Contract.createFromData(mockSingleContract());
      component.isChangeable = true;
      component.ngOnChanges({});
    });

    it('should provide the items to the form array', async () => {
      expect(component.itemsFormArray).toHaveLength(4);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.itemsFormArray = new FormArray([]);
      component.object = Contract.createFromData(mockSingleContract());
      component.isChangeable = true;
      component.ngOnChanges({});
      fixture.detectChanges();
    });

    it('should show the add button if contract is changeable', async () => {
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



