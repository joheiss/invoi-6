import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {CountryListComponent} from './country-list.component';
import {SharedModule} from '../../../shared/shared.module';
import {mockAllCountries, mockSingleCountry} from '../../../test/factories/mock-settings.factory';
import {of, Subscription} from 'rxjs/index';
import {MatDialog} from '@angular/material';
import {SettingsBusinessService} from '../../business-services';

describe('Country List Component', () => {

  let component: CountryListComponent;
  let fixture: ComponentFixture<CountryListComponent>;
  let service: SettingsBusinessService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      declarations: [CountryListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: SettingsBusinessService,
          useValue: {
            getSupportedLanguages: jest.fn(() => ['de', 'en']),
            getCountrySettings: jest.fn(() => of(mockAllCountries())),
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
    fixture = TestBed.createComponent(CountryListComponent);
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

    it('should invoke service getSupportedLanguages and getCountrySettings when component is initialized', async () => {
      const spyGetSupportedLanguages = jest.spyOn(service, 'getSupportedLanguages');
      const spyGetCountrySettings = jest.spyOn(service, 'getCountrySettings');
      await expect(spyGetSupportedLanguages).toHaveBeenCalled();
      return expect(spyGetCountrySettings).toHaveBeenCalled();
    });

    it('should return the number of translations existing for a county', () => {
      const country = mockSingleCountry();
      expect(component.getNamesCount(country)).toEqual(2);
    });

    it('should open the details dialog if add translation button is pressed for a country', () => {
      const country = mockSingleCountry();
      const spy = jest.spyOn<any, any>(component, 'openDetailsDialog');
      component.onAddTranslation(country);
      expect(spy).toHaveBeenCalledWith('translate', country);
    });

    it('should update the country settings if a country is deleted', () => {
      const countrySettings = mockAllCountries();
      const spy = jest.spyOn<any, any>(service, 'update');
      // US is not stored in country settings, so result == input
      component.onDelete({ isoCode: 'US', names: { de: 'USA', en: 'USA'}});
      expect(spy).toHaveBeenCalledWith(countrySettings);
    });

    it('should open the details dialog if new button is pressed', () => {
      const countryToCreate = { names: { de: null, en: null } };
      const spy = jest.spyOn<any, any>(component, 'openDetailsDialog');
      component.onNew(new Event('click'));
      expect(spy).toHaveBeenCalledWith('new', countryToCreate);
    });

    it('should open the details dialog if country is selected', () => {
      const country = mockSingleCountry();
      const spy = jest.spyOn<any, any>(component, 'openDetailsDialog');
      component.onSelect(country);
      expect(spy).toHaveBeenCalledWith('edit', country);
    });

    it('should open the country details dialog when requested', () => {
      const country = mockSingleCountry();
      const spy = jest.spyOn(dialog, 'open');
      component['openDetailsDialog']('edit', country);
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
      await expect(count).toBe(4);
      de = fixture.debugElement.query(By.css('mat-table mat-header-row'));
      await expect(de).toBeTruthy();
    });

    it('should invoke onNew handler when create button is pressed', async () => {
      const spy = jest.spyOn(component, 'onNew');
      fixture.debugElement.query(By.css('#btn_new')).triggerEventHandler('click', null);
      return expect(spy).toHaveBeenCalled();
    });

  });

});
