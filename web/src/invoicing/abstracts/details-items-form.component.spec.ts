import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ContractItemsFormComponent} from '../components';
import {SharedModule} from '../../shared/shared.module';
import {FormArray} from '@angular/forms';
import {ContractsBusinessService} from '../business-services';
import {mockSingleContract} from '../../test/factories/mock-contracts.factory';
import {of} from 'rxjs/internal/observable/of';
import {mockAuth} from '../../test/factories/mock-auth.factory';
import {Store} from '@ngrx/store';
import {ContractFactory} from 'jovisco-domain';

describe('Abstract Details Items Form Component', () => {

  let component: ContractItemsFormComponent;
  let fixture: ComponentFixture<ContractItemsFormComponent>;
  let service: ContractsBusinessService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [ContractItemsFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ContractsBusinessService,
          useValue: {
            change: jest.fn(),
            copy: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            new: jest.fn(),
            update: jest.fn(),
            addItem: jest.fn(),
            removeItem: jest.fn()
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
    fixture = TestBed.createComponent(ContractItemsFormComponent);
    service = TestBed.inject(ContractsBusinessService);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.object = ContractFactory.fromData(mockSingleContract());
      component.itemsFormArray = new FormArray([]);
      component['buildItems'] = jest.fn();
    });

    it('should build the items on the form', async () => {
      const spy = jest.spyOn<any, any>(component, 'buildItems');
      await component.ngOnChanges({});
      return expect(spy).toHaveBeenCalled();
    });

    it('should invoke service.addItem when onAdd is handled', async () => {
      const spy = jest.spyOn(service, 'addItem');
      await component.onAdd(new Event('click'));
      return expect(spy).toHaveBeenCalledWith(component.object);
    });

    it('should invoke service.change when onChanged is handled', async () => {
      const spy = jest.spyOn(service, 'change');
      await component.onChanged();
      return expect(spy).toHaveBeenCalledWith(component.object);
    });

    it('should invoke service.removeItem and mark form as dirty when onDelete is handled', async () => {
      const spy = jest.spyOn(service, 'removeItem');
      const spyDirty = jest.spyOn(component.itemsFormArray, 'markAsDirty');
      await component.onDelete(4);
      await expect(spy).toHaveBeenCalledWith(component.object, 4);
      return expect(spyDirty).toHaveBeenCalled();
    });

  });
});



