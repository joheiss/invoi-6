import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {RevenueListComponent} from './revenue-list.component';
import {mockAllRevenuesPerYear} from '../../../test/factories/mock-revenues.factory';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';

describe('Revenue List Component', () => {

  let component: RevenueListComponent;
  let fixture: ComponentFixture<RevenueListComponent>;
  let utility: I18nUtilityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [RevenueListComponent],
      providers: [
        I18nUtilityService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
   utility = TestBed.inject(I18nUtilityService);
    fixture = TestBed.createComponent(RevenueListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.revenues = mockAllRevenuesPerYear();
    });

    it('should provide the revenues for the recent 3 years', async () => {
      expect(component.revenues.length).toBe(3);
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.revenues = mockAllRevenuesPerYear();
      fixture.detectChanges();
    });

    it('should show a table with header line and 3 lines with revenues', async () => {
      let de: DebugElement;
      de = fixture.debugElement.query(By.css('.table'));
      await expect(de).toBeTruthy();
      const count = de.children.length;
      await expect(count).toBe(4);
    });
  });
});


