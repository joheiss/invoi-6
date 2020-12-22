import {OverviewComponent} from '..';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RevenuesBusinessService} from '../../business-services';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('Overview Component', () => {

  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let service: RevenuesBusinessService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [OverviewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: RevenuesBusinessService,
          useValue: {
            calculateTotalRevenues: jest.fn(),
            selectOpenInvoices: jest.fn()
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(RevenuesBusinessService);
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {
    beforeEach(() => {
    });

    it('should invoke service getDocumentLinks when main object changes', () => {
      const spyCalculateTotalRevenues = jest.spyOn(service, 'calculateTotalRevenues');
      const spySelectOpenInvoices = jest.spyOn(service, 'selectOpenInvoices');
      component.ngOnInit();
      expect(spyCalculateTotalRevenues).toHaveBeenCalled();
      expect(spySelectOpenInvoices).toHaveBeenCalled();
    });

  });

  describe('View', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should embed revenue list and open invoice list', () => {
      let de = fixture.debugElement.query(By.css('jo-revenue-list'));
      expect(de).toBeTruthy();
      de = fixture.debugElement.query(By.css('jo-open-invoice-list'));
      expect(de).toBeTruthy();
    });

  });
});
