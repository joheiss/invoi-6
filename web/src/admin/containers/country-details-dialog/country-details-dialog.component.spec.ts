import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormArray, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {By} from '@angular/platform-browser';
import {CountryDetailsDialogComponent} from './country-details-dialog.component';
import {SharedModule} from '../../../shared/shared.module';
import {CountryData} from 'jovisco-domain';

describe('Country Details Dialog Component', () => {

  let component: CountryDetailsDialogComponent;
  let fixture: ComponentFixture<CountryDetailsDialogComponent>;
  let dialogRef: MatDialogRef<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [CountryDetailsDialogComponent],
      providers: [
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
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(async () => {
    dialogRef = TestBed.inject(MatDialogRef);
    fixture = TestBed.createComponent(CountryDetailsDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('View', () => {

    describe('When dialog is initially displayed ...', () => {
      describe('When new country is to be created ...', () => {

        const data = {
          task: 'new',
          title: 'Neues Land anlegen',
          country: {names: {}} as CountryData,
          supportedLanguages: ['de', 'en']
        };
        return testForm(data);
      });

      describe('When existing user is to be edited ...', () => {

        const data = {
          task: 'edit',
          title: 'Länderbezeichnungen pflegen',
          country: {isoCode: 'DE', names: {de: 'Deutschland'}} as CountryData,
          supportedLanguages: ['de', 'en']
        };
        return testForm(data);
      });

    });

    describe('When dialog content is edited ...', () => {

      describe('When common fields are edited ...', () => {

        beforeEach(async () => {
          component.data = {
            task: 'edit',
            title: 'Länderbezeichnungen pflegen',
            country: {isoCode: 'DE', names: {de: 'Deutschland'}} as CountryData,
            supportedLanguages: ['de', 'en']
          };
          component.form = undefined;
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should be invalid when not completely filled in', async () => {
          const translations = component.form.controls['translations'] as FormArray;
          const translation = translations.at(0) as FormGroup;
          translation.controls['name'].setValue(null);
          fixture.detectChanges();
          return expect(component.form.valid).toBeFalsy();
        });

        it('should have all buttons except cancel disabled if form has validation errors', async () => {
          const translations = component.form.controls['translations'] as FormArray;
          const translation = translations.at(0) as FormGroup;
          translation.controls['name'].setValue(null);
          fixture.detectChanges();
          await expect(component.form.valid).toBeFalsy();
          const des = fixture.debugElement.query(By.css('mat-dialog-actions')).children
            .filter(de => !(de.nativeElement as HTMLButtonElement).disabled);
          expect(des.length).toBe(1);
          const btn = fixture.debugElement.query(By.css('#btn_cancel')).nativeElement as HTMLButtonElement;
          expect(btn.disabled).toBeFalsy();
        });

        it('should have save resp. create button enabled if form is dirty', async () => {
          component.form.markAsDirty();
          await expect(component.form.valid && component.form.dirty).toBeTruthy();
          const des = fixture.debugElement.query(By.css('mat-dialog-actions')).children
            .filter(de => !(de.nativeElement as HTMLButtonElement).disabled);
          expect(des.length).toBe(2);
          const btn = fixture.debugElement.query(By.css('#btn_save')).nativeElement as HTMLButtonElement;
          expect(btn.disabled).toBeFalsy();
        });

        it('should invoke onSave handler when save button is pressed', async () => {
          const spy = jest.spyOn(component, 'onSave');
          fixture.debugElement.query(By.css('#btn_save')).triggerEventHandler('click', component.form);
          return expect(spy).toHaveBeenCalledWith(component.form);
        });

      });

      describe('When fields for country creation are edited ...', () => {

        beforeEach(async () => {
          component.data = {
            task: 'new',
            title: 'Neues Land anlegen',
            country: { names: { de: 'Deutschland' } },
            supportedLanguages: ['de', 'en']
          };
          component.form = undefined;
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should have an error if no translation is entered', async () => {
          const translations = component.form.controls['translations'] as FormArray;
          const translation = translations.at(0) as FormGroup;
          translation.controls['name'].setValue(null);
          fixture.detectChanges();
          const errors = translation.controls['name'].errors || {};
          return expect(errors['required']).toBeTruthy();
        });

        it('should invoke onSave handler when create button is pressed', async () => {
          const spy = jest.spyOn(component, 'onSave');
          fixture.debugElement.query(By.css('#btn_create')).triggerEventHandler('click', component.form);
          return expect(spy).toHaveBeenCalledWith(component.form);
        });
      });
    });
  });

  describe('Controller', () => {

    beforeEach(() => {
      component.data = {
        task: 'edit',
        title: 'Länderbezeichnungen pflegen',
        country: {isoCode: 'DE', names: {de: 'Deutschland'}} as CountryData,
        supportedLanguages: ['de', 'en']
      };
      component.form = undefined;
    });

    describe('ngOnInit', () => {

      it('should invoke buildForm', async () => {
        const spy = jest.spyOn<any, any>(component, 'buildForm');
        component.ngOnInit();
        return expect(spy).toHaveBeenCalled();
      });
    });

    describe('onSave', () => {

      it('should invoke changeObject and MatDialogRef.close in any case', async () => {
        // @ts-ignore
        const spyChangeObject = jest.spyOn(component, 'changeObject');
        const spyClose = jest.spyOn(dialogRef, 'close');
        await component.ngOnInit();
        component.onSave(component.form);
        expect(spyChangeObject).toHaveBeenCalledWith<any>(component.form.value);
        return expect(spyClose).toHaveBeenCalled();
      });
    });
  });

  async function testForm(data: any) {

    beforeEach(async () => {
      component.data = data;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show the correct title', async () => {

      const h1 = fixture.debugElement.query(By.css('h1')).nativeElement as HTMLHeadingElement;
      let title: string;
      if (component.data.task === 'new') {
        title = 'Neues Land anlegen';
      } else {
        title = 'Länderbezeichnungen pflegen';
      }
      return expect(h1.textContent).toEqual(title);
    });

    it('should show the buttons for save and cancel', async () => {
      const expected = 2;
      const count = fixture.debugElement.queryAll(By.css('button')).length;
      return expect(count).toEqual(expected);
    });
  }
});


