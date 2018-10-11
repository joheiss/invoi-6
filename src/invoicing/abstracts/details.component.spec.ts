import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ContractDetailsComponent} from '../containers';
import {ContractsBusinessService} from '../business-services';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {cold} from 'jasmine-marbles';
import {generateContract} from '../../test/test-generators';
import {Contract} from '../models/contract.model';

describe('Abstract Details Component', () => {

  let component: ContractDetailsComponent;
  let fixture: ComponentFixture<ContractDetailsComponent>;
  let service: ContractsBusinessService;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule],
      declarations: [ContractDetailsComponent],
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
            update: jest.fn()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: cold('-a|', { a: { get: () => '4901' }})
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
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    let object: Contract;

    beforeEach(() => {
      object = generateContract();
    });

    it('should return the id from the route params', async () => {
      route.paramMap.subscribe(p => expect(p.get('id')).toEqual('4901'));
    });

    it('should invoke service.change when onChanged is processed', async () => {
      const spy = jest.spyOn(service, 'change');
      component.onChanged(object);
      return expect(spy).toHaveBeenCalledWith(object);
    });

    it('should invoke service.change when onChanged is processed', async () => {
      const spy = jest.spyOn(service, 'change');
      component.onChanged(object);
      return expect(spy).toHaveBeenCalledWith(object);
    });

    it('should invoke service.create when onCreate is processed', async () => {
      const spy = jest.spyOn(service, 'create');
      component.onCreate(object);
      return expect(spy).toHaveBeenCalledWith(object);
    });

    it('should invoke service.copy when onCopy is processed', async () => {
      const spy = jest.spyOn(service, 'copy');
      component.onCopy(object);
      return expect(spy).toHaveBeenCalledWith(object);
    });

    it('should invoke service.delete when onDelete is processed', async () => {
      const spy = jest.spyOn(service, 'delete');
      component.onDelete(object);
      return expect(spy).toHaveBeenCalledWith(object);
    });

    it('should invoke service.new when onNew is processed', async () => {
      const spy = jest.spyOn(service, 'new');
      component.onNew();
      return expect(spy).toHaveBeenCalled();
    });

    it('should invoke service.update when onUpdate is processed', async () => {
      const spy = jest.spyOn(service, 'update');
      component.onUpdate(object);
      return expect(spy).toHaveBeenCalledWith(object);
    });
  });
});


