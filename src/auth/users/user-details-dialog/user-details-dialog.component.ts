import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User, UserData} from '../../models/user';
import {UsersBusinessService} from '../../business-services/users-business.service';
import {passwordValidator} from '../../validators/password.validator';
import {REGEXP_PHONE, REGEXP_URL} from '../../../shared/validators';
import {PasswordChangeDialogComponent} from '../../password-change-dialog/password-change-dialog.component';
import {UsersUiService} from '../../services';

@Component({
  selector: 'jo-user-details-dialog',
  templateUrl: './user-details-dialog.component.html',
  styleUrls: ['./user-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsDialogComponent implements OnInit {
  form: FormGroup;
  passwords: FormGroup;
  thumbnailUrl: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<UserDetailsDialogComponent>,
              private service: UsersBusinessService,
              private uiService: UsersUiService) {
  }

  ngOnInit(): void {
    if (!this.form) {
      this.thumbnailUrl = this.service.getThumbnailUrlForSize(this.data.user.imageUrl, '64');
      this.form = this.buildForm();
      this.patchForm();
    } else {
      this.patchForm();
    }
  }

  onChangePassword(user: User) {
    const userToEdit = user;
    let popupData;
    if (this.data.task === 'my-profile') {
       popupData = { title: 'Mein Passwort ändern', task: 'change', user: userToEdit };
    } else {
      popupData = { title: 'Passwort setzen', task: 'set', user: userToEdit };
    }
    this.uiService.openPasswordChangePopup(popupData, PasswordChangeDialogComponent);
  }

  onDeleteImage(user: User) {
    this.service.deleteProfileImage(user);
  }

  onSave(form: FormGroup) {
    const edited = this.changeObject(form.value);
    if (edited.user.uid) {
      // update
      this.service.updateProfile(edited.user);
    } else {
      // create
      this.service.create(edited);
    }
    this.dialogRef.close(this.data.user);
  }

  onUploadImage(user) {
    this.service.uploadProfileImage(user);
  }

  private buildForm(): FormGroup {
    const form = this.fb.group({
      uid: [{value: '', disabled: true}],
      email: [{ value: '', disabled: this.data.task !== 'new' }, [Validators.required, Validators.email]],
      displayName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.pattern(REGEXP_PHONE)]],
      organization: [{ value: '', disabled: this.data.task === 'my-profile' }, [Validators.required]],
      roles: [{ value: '', disabled: this.data.task === 'my-profile' }, [Validators.required]],
      imageUrl: ['', [Validators.pattern(REGEXP_URL)]],
      isLocked: [{ value: '', disabled: this.data.task === 'my-profile' }]
    });
    if (this.data.task === 'new') {
      this.passwords = this.fb.group({
        password: ['', [Validators.required]],
        confirm: ['', [Validators.required]]
      }, { validator: passwordValidator });
      form.addControl('passwords', this.passwords);
    }
    return form;
  }

  private changeObject(values: any): { user: User, password: string} {
    const { passwords,  ...user} = values;
    let roles;
    if (this.data.task !== 'my-profile') {
      roles = typeof(values.roles) === 'string' ? values.roles.replace(' ', '').split(',') : values.roles;
    } else {
      roles = this.data.user.roles;
    }
    const reformattedValues = {
      roles: roles
    };
    const changed = Object.assign({},
      {...this.data.user.data},
      {...user},
      {...reformattedValues}) as UserData;
    let password = null;
    if (this.passwords) {
      password = values.passwords.password;
    }
    return { user: User.createFromData(changed), password: password };
  }

  private patchForm(): void {
    const reformattedValues = {
      roles: this.data.user.roles
    };
    const patch = Object.assign({}, {...this.data.user.data, reformattedValues });
    this.form.patchValue(patch);
  }
}
