import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ContractCardComponent} from '../components';
import {mockSingleContract} from '../../test/factories/mock-contracts.factory';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Contract, ContractFactory} from 'jovisco-domain';

describe('Abstract Master Card Component', () => {

  let component: ContractCardComponent;
  let fixture: ComponentFixture<ContractCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ContractCardComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.summary = {
        object: ContractFactory.fromData(mockSingleContract()),
        receiverName: 'Test Receiver',
        changeable: true,
        revenue: 123456.78,
        lastInvoiceId: '5909' };
    });

    it('should emit copy event if onCopy is handled', async() => {
      const spy = jest.spyOn(component.copy, 'emit');
      component.onCopy();
      expect(spy).toHaveBeenCalledWith(component.summary.object);
    });

    it('should emit delete event if onDelete is handled', async() => {
      const spy = jest.spyOn(component.delete, 'emit');
      component.onDelete();
      expect(spy).toHaveBeenCalledWith(component.summary.object);
    });
  });
});

