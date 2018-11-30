import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COUNTRY_TASK_EDIT, COUNTRY_TASK_NEW_COUNTRY, COUNTRY_TASK_NEW_TRANSLATION} from '../../models/country';

@Component({
  selector: 'jo-country-details-dialog',
  templateUrl: './country-details-dialog.component.html',
  styleUrls: ['./country-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryDetailsDialogComponent implements OnInit {

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<CountryDetailsDialogComponent>) {
  }

  ngOnInit(): void {
    if (!this.form) {
      this.form = this.buildForm();
    }
    this.patchForm();
  }

  get translations(): AbstractControl[] {
    const array = this.form.get('translations') as FormArray;
    return array.controls;
  }

  onSave(form: FormGroup) {
    const edited = this.changeObject(form.value);
    this.data.country = edited;
    this.dialogRef.close(this.data);
  }

  private addLanguage(languageDisabled = true): FormGroup {
    const langValidators = [Validators.required];
    if (!languageDisabled) {
      langValidators.push(this.validateLanguageNotYetExists.bind(this));
    }
    return this.fb.group({
      langCode: [''],
      language: [{value: '', disabled: languageDisabled}, langValidators],
      name: ['', [Validators.required]]
    });
  }

  private addLanguages(): FormGroup[] {
    const groups = [];
    if (this.data.task === COUNTRY_TASK_EDIT) {
      Object.keys(this.data.country.names).forEach(language => groups.push(this.addLanguage()));
    } else if (this.data.task === COUNTRY_TASK_NEW_COUNTRY) {
      this.data.supportedLanguages.forEach(language => groups.push(this.addLanguage()));
    } else {
      groups.push(this.addLanguage(false));
    }
    return groups;
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      isoCode: [{value: '', disabled: this.data.task !== COUNTRY_TASK_NEW_COUNTRY}],
      translations: new FormArray(this.addLanguages())
    });
  }

  private changeObject(values: any): any {
    const changed = Object.assign({}, this.data.country);
    if (values.isoCode && values.isoCode.length >= 2) {
      changed.isoCode = values.isoCode;
    }
    values.translations.forEach(translation => {
      if (translation.language && translation.language.length >= 2 && translation.name && translation.name.length > 0) {
        changed.names[translation.language] = translation.name;
      } else if (translation.langCode && translation.langCode.length >= 2 && translation.name && translation.name.length > 0) {
        changed.names[translation.langCode] = translation.name;
      }
    });
    return changed;
  }

  private logForm() {
    console.log('FORM: ', this.form);
  }

  private patchForm(): void {
    let patch: any;
    patch = Object.assign({}, {isoCode: this.data.country.isoCode, translations: []});
    if (this.data.task !== COUNTRY_TASK_NEW_TRANSLATION) {
      Object.keys(this.data.country.names).forEach(key => patch.translations.push({
        langCode: key,
        language: key,
        name: this.data.country.names[key]
      }));
    } else {
      patch.translations.push({
        langCode: this.data.language,
        language: this.data.language,
        name: this.data.translation
      });
    }
    this.form.patchValue(patch);
  }

  validateLanguageNotYetExists(control: FormControl) {
    return this.data.country.names[control.value] ? { translationExists: true } : null;
  }
}
