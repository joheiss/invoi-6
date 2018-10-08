import {FormControl, FormGroup, Validators} from '@angular/forms';
import {passwordValidator} from './password.validator';

describe('Password Validator', () => {

  let passwords: FormGroup;

  beforeEach(() => {
     passwords = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('', [Validators.required]),
    }, passwordValidator);
  });

  it('should return an error if password and confirmation do not match', () => {
    passwords.controls['password'].setValue('SagIchNicht');
    passwords.controls['confirm'].setValue('SagIchAuchNicht');
    expect(passwords.errors).toEqual({ passwordMatch: true });
  });

  it('should return no error if password and confirmation match', () => {
    passwords.controls['password'].setValue('SagIchNicht');
    passwords.controls['confirm'].setValue('SagIchNicht');
    expect(passwords.errors).toBeFalsy();
  });
});
