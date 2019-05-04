import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {passwordValidator} from '../validators/password.validator';
import {UsersBusinessService} from '../business-services/users-business.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserDetailsDialogComponent} from '../users/user-details-dialog/user-details-dialog.component';

@Component({
  selector: 'jo-password-change-dialog',
  templateUrl: './password-change-dialog.component.html',
  styleUrls: ['./password-change-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    if (!this.form) {
      this.form = this.buildForm();
      this.patchForm();
    } else {
      this.patchForm();
    }
  }

  onSave(form: FormGroup) {
    const edited = this.changeObject(form.value);
    this.service.changePassword(edited);
    this.dialogRef.close();
  }

  private buildForm(): FormGroup {
    const form = this.fb.group({
      email: [{ value: '', disabled: true }],
      oldPassword: ['', this.data.task === 'change' ? [Validators.required] : []],
    });
    this.passwordConfirm = this.fb.group({
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required]]
    } , { validator: passwordValidator });
    form.addControl('passwordConfirm', this.passwordConfirm);
    return form;
  }

  private changeObject(values: any): any {
    const { passwordConfirm: { password }, oldPassword } = values;
    return Object.assign({}, {
      uid: this.data.user.uid,
      email: this.data.user.email,
      oldPassword: oldPassword,
      password: password
    });
  }

  private patchForm(): void {
    const { uid, email } = this.data.user.data;
    const patch = Object.assign({}, { uid, email, oldPassword: this.oldPassword, password: this.password, confirm: this.confirm });
    this.form.patchValue(patch);
  }
}
