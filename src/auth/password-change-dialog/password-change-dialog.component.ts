import {Component, Inject, OnInit} from '@angular/core';
import {passwordValidator} from '../validators/password.validator';
import {UsersBusinessService} from '../business-services/users-business.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserDetailsDialogComponent} from '../users/user-details-dialog/user-details-dialog.component';

@Component({
  selector: 'jo-password-change-dialog',
  templateUrl: './password-change-dialog.component.html',
  styleUrls: ['./password-change-dialog.component.scss']
})
export class PasswordChangeDialogComponent implements OnInit {

  form: FormGroup;
  passwordConfirm: FormGroup;
  oldPassword: string;
  password: string;
  confirm: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<UserDetailsDialogComponent>,
              private service: UsersBusinessService) {
  }

  ngOnInit(): void {
    console.log('DATA: ', this.data);
    if (!this.form) {
      this.form = this.buildForm();
      this.patchForm();
    } else {
      this.patchForm();
    }
  }

  onSave(form: FormGroup) {
    const edited = this.changeObject(form.value);
    console.log('Change password: ', edited);
    this.service.changePassword(edited);
    this.dialogRef.close();
  }

  private buildForm(): FormGroup {
    const form = this.fb.group({
      email: [{ value: '', disabled: true }],
      oldPassword: ['', this.data.task === 'my-profile' ? [Validators.required] : []],
    });
    this.passwordConfirm = this.fb.group({
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required]]
    } , { validator: passwordValidator });
    form.addControl('passwordConfirm', this.passwordConfirm);
    console.log('Form: ', form);
    return form;
  }

  private changeObject(values: any): any {
    const { passwordConfirm: { password }, oldPassword } = values;
    const changed = Object.assign({}, {
      uid: this.data.user.uid,
      email: this.data.user.uid,
      oldPassword: oldPassword,
      password: password
    });
    console.log('CHANGED: ', changed);
    return changed;
  }

  private patchForm(): void {
    const { uid, email } = this.data.user.data;
    const patch = Object.assign({}, { uid, email, oldPassword: this.oldPassword, password: this.password, confirm: this.confirm });
    console.log('PATCH: ', patch);
    this.form.patchValue(patch);
  }
}
