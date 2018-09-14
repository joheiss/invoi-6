import {AbstractControl} from '@angular/forms';
import * as moment from 'moment';

export const endDateValidator = (control: AbstractControl): { [key: string]: boolean } => {
  const startDate = control.get('startDate').value;
  const endDate = control.get('endDate').value;
  const momStartDate = moment(startDate);
  const momEndDate = moment(endDate);
  if (!startDate || !endDate || momEndDate >= momStartDate) {
    return null;
  }
  control.get('endDate').setErrors({ 'dateSequence': true });
  return { 'dateSequence' : true };
};


