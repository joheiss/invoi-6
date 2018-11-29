import {CardButtonsComponent} from '..';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {mockContractSummary} from '../../../test/factories/mock-contracts.factory';
import {By} from '@angular/platform-browser';

describe('Card Buttons Component', () => {

  let component: CardButtonsComponent;
  let fixture: ComponentFixture<CardButtonsComponent>;

  beforeEach(async () => {
    return TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MaterialModule, FlexLayoutModule],
      declarations: [CardButtonsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardButtonsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('View', () => {

    describe('When component is initially displayed', () => {

      beforeEach(() => {
        component.object = mockContractSummary().object;
        fixture.detectChanges();
      });

      it(`should show the details button`, async () => {
        const a = fixture.debugElement.query(By.css('#btn_details'));
        return expect(a).toBeDefined();
      });

      it(`should show the copy button`, async () => {
        const btn = fixture.debugElement.query(By.css('#btn_copy'));
        return expect(btn).toBeDefined();
      });

      it(`should not show the delete button if contract is not deletable`, async () => {
        component.isDeletable = false;
        const btn = fixture.debugElement.query(By.css('#btn_delete'));
        return expect(btn).toBeFalsy();
      });

      it('should navigate to object details when details button is pressed', async () => {
        const a = fixture.debugElement.query(By.css('#btn_details')).nativeElement as HTMLAnchorElement;
        const href = a['routerLink'];
        console.log('href: ', href);
        return expect(href).toEqual([`/invoicing/${component.object.header.objectType}`, `${component.object.header.id}`]);
      });

      it('should invoke onCopy handler when copy button is pressed', async () => {
        const spy = jest.spyOn(component, 'onCopy');
        fixture.debugElement.query(By.css('#btn_copy')).triggerEventHandler('click', null);
        return expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('When component is initially displayed for a deletable contract', () => {

    beforeEach(() => {
      component.object = mockContractSummary().object;
      component.isDeletable = true;
      fixture.detectChanges();
    });

    it(`should show the delete button if contract is deletable`, async () => {
      const btn = fixture.debugElement.query(By.css('#btn_delete'));
      return expect(btn).toBeTruthy();
    });

    it('should invoke onDelete handler when delete button is pressed', async () => {
      const spy = jest.spyOn(component, 'onDelete');
      fixture.debugElement.query(By.css('#btn_delete')).triggerEventHandler('click', null);
      return expect(spy).toHaveBeenCalled();
    });
  });
});
