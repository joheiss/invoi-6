import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {I18nUtilityService} from '../../../shared/i18n-utility/i18n-utility.service';
import * as fromValidators from '../../../shared/validators';
import {Vat, VAT_TASK_NEW_TAXCODE} from '../../models/vat';

@Component({
  selector: 'jo-vat-details-dialog',
  templateUrl: './vat-details-dialog.component.html',
  styleUrls: ['./vat-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VatDetailsDialogComponent implements OnInit {

  form: FormGroup;
  passwords: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<VatDetailsDialogComponent>,
              private utility: I18nUtilityService) {
  }

  ngOnInit(): void {
    if (!this.form) {
      this.form = this.buildForm();
    }
    this.patchForm();
  }

  onSave(form: FormGroup) {
    const edited = this.changeObject(form.value);
    this.data.vat = edited;
    this.dialogRef.close(this.data);
  }

  protected buildForm(): FormGroup {
   return this.fb.group({
      taxCode: [ {value: '', disabled: this.data.task !== VAT_TASK_NEW_TAXCODE }],
      validFrom: [{ value: '', disabled: false }, [Validators.required]],
      validTo: [{ value: '', disabled: false }, [Validators.required]],
      percentage: ['', [Validators.required, Validators.pattern(fromValidators.REGEXP_AMOUNT)]]
    });
  }

  protected changeObject(values: any): Vat {
    const { vat } = values;
    const reformattedValues = {
      taxCode: values.taxCode || this.data.vat.taxCode,
      validFrom: moment(values.validFrom).toDate(),
      validTo: moment(values.validTo).toDate(),
      percentage: this.utility.fromLocalPercent(values.percentage)
    };
    const changed = Object.assign({},
      {...this.data.vat},
      {...vat},
      {...reformattedValues});
    return changed;
  }

  protected patchForm(): void {
    const reformattedValues = {
      percentage: this.utility.toLocalPercent(this.data.vat.percentage)
    };
    const patch = Object.assign({}, {...this.data.vat}, {...reformattedValues});
    this.form.patchValue(patch);
  }
}
