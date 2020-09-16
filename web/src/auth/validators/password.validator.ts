import {AbstractControl} from '@angular/forms';

export const passwordValidator = (control: AbstractControl): { [key: string]: boolean } => {
  const password = control.get('password').value;
  const confirm = control.get('confirm').value;
  if (password === confirm) {
    return null;
  }
  control.get('confirm').setErrors({ 'passwordMatch': true });
  return { 'passwordMatch' : true };
};
