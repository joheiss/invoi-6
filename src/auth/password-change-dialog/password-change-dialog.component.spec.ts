import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PasswordChangeDialogComponent} from './password-change-dialog.component';
import {UsersBusinessService} from '../business-services/users-business.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {generateUserProfile} from '../../test/test-generators';
import {User} from '../models/user';

describe('PasswordChangeDialogComponent', () => {
  let component: PasswordChangeDialogComponent;
  let fixture: ComponentFixture<PasswordChangeDialogComponent>;
  let service: UsersBusinessService;
  let dialogRef: MatDialogRef<any>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule, FormsModule, ReactiveFormsModule],
      declarations: [PasswordChangeDialogComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {task: 'my-profile', user: User.createFromData(generateUserProfile())}},
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn()
          }
        },
        {
          provide: UsersBusinessService,
          useValue: {
            changePassword: jest.fn(),
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = TestBed.get(UsersBusinessService);
    dialogRef = TestBed.get(MatDialogRef);
    fixture = TestBed.createComponent(PasswordChangeDialogComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create the component', () => {
    return expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should be invalid when not completely filled in', async () => {
      return expect(component.form.valid).toBeFalsy();
    });

    it('should have an error if old password is not entered', async () => {
      const oldPassword = component.form.controls['oldPassword'];
      const errors = oldPassword.errors || {};
      return expect(errors['required']).toBeTruthy();
    });

    it('should have an error if password and confirmed password are not identical', async () => {
      component.form.controls['oldPassword'].setValue('SagIchNicht');
      const passwordConfirm = component.form.controls['passwordConfirm'] as FormGroup;
      passwordConfirm.controls['password'].setValue('SagIchAuchNicht');
      passwordConfirm.controls['confirm'].setValue('IchSagNix');
      const errors = passwordConfirm.errors || {};
      return expect(errors['passwordMatch']).toBeTruthy();
    });
  });

  describe('Form Submit', () => {
    it('should invoke service.changePassword', async () => {
      component.form.controls['oldPassword'].setValue('SagIchNicht');
      const passwordConfirm = component.form.controls['passwordConfirm'] as FormGroup;
      passwordConfirm.controls['password'].setValue('SagIchAuchNicht');
      passwordConfirm.controls['confirm'].setValue('SagIchAuchNicht');
      const spy = jest.spyOn(service, 'changePassword');
      await expect(component.onSave(component.form)).not.toBe(true);
      const expected = {
        uid: component.data.user.uid,
        email: component.data.user.email,
        oldPassword: component.form.controls['oldPassword'].value,
        password: passwordConfirm.controls['password'].value
      };
      return expect(spy).toHaveBeenCalledWith(expected);
    });
  });
});
