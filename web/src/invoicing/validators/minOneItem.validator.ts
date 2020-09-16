import {AbstractControl} from '@angular/forms';

export const minOneItemValidator = (control: AbstractControl): { [key: string]: boolean } => {
  const items = control.value;
  if (items.length > 0) {
    return null;
  }
  return { 'minItems' : true };
};


