import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {By} from '@angular/platform-browser';
import {SharedModule} from '../../../shared/shared.module';
import {VatDetailsDialogComponent} from './vat-details-dialog.component';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import {DecimalPipe, registerLocaleData} from '@angular/common';
import {mockSingleVatSetting} from '../../../test/factories/mock-settings.factory';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {VatData} from 'jovisco-domain';
import {DateTime} from 'luxon';

describe('VAT Details Dialog Component', () => {

  let component: VatDetailsDialogComponent;
  let fixture: ComponentFixture<VatDetailsDialogComponent>;
  let dialogRef: MatDialogRef<any>;
  let utility: I18nUtilityService;
  let decimalPipe: DecimalPipe;

  beforeEach(async () => {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [VatDetailsDialogComponent],
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        DecimalPipe,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            dimensions: {},
            data: {}
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn()
          }
        },
        {
          provide: I18nUtilityService,
          useValue: {
            fromLocalPercent: jest.fn((amount: any) => {
              if (!amount) {
                return 0;
              }
              if (typeof amount !== 'string') {
                return amount;
              }

              const toBeConverted = amount
                .replace(new RegExp('.'.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '')
                .replace(new RegExp(','.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '.');
              return parseFloat(toBeConverted);
            }),
            toLocalPercent: jest.fn((percent: number) => {
              if (!percent && percent !== 0) {
                return null;
              }
              return decimalPipe.transform(percent, '1.1-3', 'de-DE');
            })
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(async () => {
    decimalPipe = TestBed.get(DecimalPipe);
    utility = TestBed.get(I18nUtilityService);
    dialogRef = TestBed.get(MatDialogRef);
    fixture = TestBed.createComponent(VatDetailsDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.form = undefined;
      component.data.vat = mockSingleVatSetting();
    });

    it('should invoke buildForm and patchForm when component is initialized', async () => {
      const spyBuild = jest.spyOn<any, any>(component, 'buildForm');
      const spyPatch = jest.spyOn<any, any>(component, 'patchForm');
      component.ngOnInit();
      await expect(spyBuild).toHaveBeenCalled();
      return expect(spyPatch).toHaveBeenCalled();
    });

    it('should invoke changeObject and close the dialog when save button is pressed', async () => {
      const spyChangeObject = jest.spyOn<any, any>(component, 'changeObject');
      const spyClose = jest.spyOn(dialogRef, 'close');
      await component.ngOnInit();
      component.onSave(component.form);
      await expect(spyChangeObject).toHaveBeenCalledWith(component.form.value);
      return expect(spyClose).toHaveBeenCalled();
    });

    it('should build the form from the given vat settings when component is initialized', async () => {
      const vatSetting = mockSingleVatSetting();
      await component.ngOnInit();
      expect(component.form.controls['taxCode'].value).toEqual(vatSetting.taxCode);
      expect(component.form.controls['validFrom'].value).toEqual(vatSetting.validFrom);
      expect(component.form.controls['validTo'].value).toEqual(vatSetting.validTo);
      expect(component.form.controls['percentage'].value).toEqual(utility.toLocalPercent(vatSetting.percentage));
    });
  });

  describe('View', () => {

    describe('When new vat entry is to be created ...', () => {

      const vatToCreate = Object.assign({}, {
        validFrom: DateTime.utc().startOf('day').toJSDate(),
        validTo: DateTime.utc(9999, 12, 31).endOf('day').toJSDate()
      }) as VatData;
      const data = {task: 'new', vat: vatToCreate};
      return testForm(data);
    });

    describe('When existing vat entry is to be edited ...', () => {

      const vatToEdit = mockSingleVatSetting();
      const data = {task: 'edit', vat: vatToEdit};
      return testForm(data);
    });

    describe('When a new validity period is entered for an existing vat entry ...', () => {

      const vatToEdit = mockSingleVatSetting();
      const data = {task: 'period', vat: vatToEdit};
      return testForm(data);
    });
  });

  async function testForm(data: any) {

    const buttonsToShow: string[] = [];
    const buttonsNotToShow: string[] = [];

    beforeEach(async () => {
      component.data = data;
      component.ngOnInit();
      fixture.detectChanges();

      buttonsToShow.push('#btn_cancel');
      if (data.task === 'new') {
        buttonsToShow.push('#btn_create');
        buttonsNotToShow.push('#btn_save', '#btn_addPeriod');
      } else if (data.task === 'period') {
        buttonsToShow.push('#btn_addPeriod');
        buttonsNotToShow.push('#btn_save', '#btn_create');
      } else {
        buttonsToShow.push('#btn_save');
        buttonsNotToShow.push('#btn_addPeriod', '#btn_create');
      }
    });

    it('should show the correct title', async () => {

      const h1 = fixture.debugElement.query(By.css('h1')).nativeElement as HTMLHeadingElement;
      const title = 'Steuersatz pflegen';
      return expect(h1.textContent).toEqual(title);
    });

    it('should show the buttons for save or create or add period and cancel', async () => {

      buttonsToShow.forEach(b => {
        const btn = fixture.debugElement.query(By.css(b));
        expect(btn).toBeTruthy();
      });
      buttonsNotToShow.forEach(b => {
        const btn = fixture.debugElement.query(By.css(b));
        expect(btn).toBeFalsy();
      });
    });

    it('should only enable the save, create or add period button if form is valid', async () => {
      component.form.controls['taxCode'].setValue(null);
      component.form.controls['percentage'].setValue(null);
      fixture.detectChanges();
      buttonsToShow
        .filter(b => b !== '#btn_cancel')
        .forEach(b => {
          const btn = fixture.debugElement.query(By.css(b)).nativeElement as HTMLButtonElement;
          expect(btn.disabled).toBeTruthy();
        });
      component.form.controls['taxCode'].setValue('XX_test');
      component.form.controls['percentage'].setValue('22,0');
      fixture.detectChanges();
      buttonsToShow
        .filter(b => b !== '#btn_cancel')
        .forEach(b => {
          const btn = fixture.debugElement.query(By.css(b)).nativeElement as HTMLButtonElement;
          expect(btn.disabled).toBeFalsy();
        });
    });
  }
});



