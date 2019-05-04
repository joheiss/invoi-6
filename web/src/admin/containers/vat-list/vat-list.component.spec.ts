import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {mockAllVatSettings, mockSingleVatSetting} from '../../../test/factories/mock-settings.factory';
import {of, Subscription} from 'rxjs/index';
import {MatDialog} from '@angular/material';
import {VatListComponent} from './vat-list.component';
import {SettingsBusinessService} from '../../business-services';
import {DateTime} from 'luxon';
import {Vat} from 'jovisco-domain';

describe('VAT List Component', () => {

  let component: VatListComponent;
  let fixture: ComponentFixture<VatListComponent>;
  let service: SettingsBusinessService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [VatListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: SettingsBusinessService,
          useValue: {
            getVatSettings: jest.fn(() => of(mockAllVatSettings())),
            update: jest.fn()
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(() => {
              return {
                afterClosed: jest.fn(() => of({name: 'anything'}))
              };
            })
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.get(SettingsBusinessService);
    dialog = TestBed.get(MatDialog);
    fixture = TestBed.createComponent(VatListComponent);
    component = fixture.componentInstance;
    component['subscription'] = new Subscription();
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.ngOnInit();
    });

    it('should invoke service getVatSettings when component is initialized', async () => {
      const spy = jest.spyOn(service, 'getVatSettings');
      return expect(spy).toHaveBeenCalled();
    });

    it('should open the details dialog if add translation button is pressed for a country', () => {
      const vat = mockSingleVatSetting();
      const vatToCopy = Object.assign({}, vat, {
        validFrom: DateTime.utc().startOf('day').toJSDate(),
        validTo: DateTime.utc(9999, 12, 31).endOf('day').toJSDate()
      }) as Vat;
      const spy = jest.spyOn<any, any>(component, 'openDetailsDialog');
      component.onAddPeriod(vat);
      expect(spy).toHaveBeenCalledWith('period', vatToCopy);
    });

    it('should update the vat settings if a vat entry is deleted', () => {
      const vatSettings = mockAllVatSettings();
      const spy = jest.spyOn<any, any>(service, 'update');
      // US is not stored in country settings, so result == input
      component.onDelete({ taxCode: 'XX_test',
        validFrom: DateTime.utc().startOf('day').toJSDate(),
        validTo: DateTime.utc(9999, 12, 31).endOf('day').toJSDate(),
        percentage: 22.0 });
      expect(spy).toHaveBeenCalledWith(vatSettings);
    });

    it('should open the details dialog if new button is pressed', () => {
      const vatToCreate = Object.assign({}, {
        validFrom: DateTime.utc().startOf('day').toJSDate(),
        validTo: DateTime.utc(9999, 12, 31).endOf('day').toJSDate()
      }) as Vat;
      const spy = jest.spyOn<any, any>(component, 'openDetailsDialog');
      component.onNew();
      expect(spy).toHaveBeenCalledWith('new', vatToCreate);
    });

    it('should open the details dialog if country is selected', () => {
      const vatSettings = mockAllVatSettings();
      const spy = jest.spyOn<any, any>(component, 'openDetailsDialog');
      component.onSelect(vatSettings);
      expect(spy).toHaveBeenCalledWith('edit', vatSettings);
    });

    it('should open the vat details dialog when requested', () => {
      const vat = mockSingleVatSetting();
      const spy = jest.spyOn(dialog, 'open');
      component['openDetailsDialog']('edit', vat);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('View', () => {
    beforeEach(async () => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show the create and the back button', async () => {
      let de: DebugElement;
      de = fixture.debugElement.query(By.css('#btn_new'));
      await expect(de).toBeTruthy();
      de = fixture.debugElement.query(By.css('#btn_back'));
      return expect(de).toBeTruthy();
    });

    it('should show a table with header line and 3 lines with users', async () => {
      let de: DebugElement;
      de = fixture.debugElement.query(By.css('mat-table'));
      await expect(de).toBeTruthy();
      const count = de.children.length;
      await expect(count).toBe(8);
      de = fixture.debugElement.query(By.css('mat-table mat-header-row'));
      await expect(de).toBeTruthy();
    });
  });
});
