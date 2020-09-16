import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ContractsComponent} from '../containers';
import {ContractsBusinessService} from '../business-services';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ContractCardComponent} from '../components';
import {mockSingleContract} from '../../test/factories/mock-contracts.factory';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Store} from '@ngrx/store';
import {of} from 'rxjs/internal/observable/of';
import {mockAuth} from '../../test/factories/mock-auth.factory';
import {SharedModule} from '../../shared/shared.module';
import {ContractFactory} from 'jovisco-domain';

describe('Abstract Master Component', () => {

  let component: ContractsComponent;
  let fixture: ComponentFixture<ContractsComponent>;
  let service: ContractsBusinessService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule, SharedModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ContractsComponent, ContractCardComponent],
      providers: [
        {
          provide: ContractsBusinessService,
          useValue: {
            getSummary: jest.fn(),
            copy: jest.fn(),
            delete: jest.fn(),
            new: jest.fn()
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
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    it('should invoke service.getSummary when ngOnInit is processed', async () => {
      const spy = jest.spyOn(service, 'getSummary');
      component.ngOnInit();
      return expect(spy).toHaveBeenCalled();
    });

    it('should invoke service.copy when onCopy is processed', async () => {
      const contract = ContractFactory.fromData(mockSingleContract());
      const spy = jest.spyOn(service, 'copy');
      component.onCopy(contract);
      return expect(spy).toHaveBeenCalledWith(contract);
    });

    it('should invoke service.delete when onDelete is processed', async () => {
      const contract = ContractFactory.fromData(mockSingleContract());
      const spy = jest.spyOn(service, 'delete');
      component.onDelete(contract);
      return expect(spy).toHaveBeenCalledWith(contract);
    });

    it('should invoke service.new when onNew is processed', async () => {
      const spy = jest.spyOn(service, 'new');
      component.onNew(new Event('click'));
      return expect(spy).toHaveBeenCalled();
    });
  });
})
;
