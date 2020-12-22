import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PasswordChangeDialogComponent} from './password-change-dialog.component';
import {UsersBusinessService} from '../business-services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {mockAllUsers, mockSingleUser} from '../../test/factories/mock-users.factory';
import {UserFactory} from 'jovisco-domain/dist/user/user-factory';

describe('PasswordChangeDialogComponent', () => {
  let component: PasswordChangeDialogComponent;
  let fixture: ComponentFixture<PasswordChangeDialogComponent>;
  let service: UsersBusinessService;
  let dialogRef: MatDialogRef<any>;

  beforeEach(async () => {
    return TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule, FormsModule, ReactiveFormsModule],
      declarations: [PasswordChangeDialogComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {task: 'my-profile', user: UserFactory.fromData(mockSingleUser())}},
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
    service = TestBed.inject(UsersBusinessService);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture = TestBed.createComponent(PasswordChangeDialogComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create the component', () => {
    return expect(component).toBeTruthy();
  });

  describe('View', () => {

    describe('When dialog is initially displayed ...', () => {

      describe(`When current user's password is to be changed ...`, () => {
        return testForm({title: 'Mein Passwort ändern', task: 'change', user: UserFactory.fromData(mockSingleUser())});
      });

      describe(`When other user's password is to be changed ...`, () => {
        return testForm({title: 'Passwort setzen', task: 'set', user: UserFactory.fromData(mockAllUsers()[1])});
      });
    });

    describe('When dialog content is edited ...', () => {

      beforeEach(async () => {
        component.data = {title: 'Passwort setzen', task: 'set', user: UserFactory.fromData(mockAllUsers()[1])};
        component.form = undefined;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should be invalid when not completely filled in', async () => {
        const passwords = component.form.controls['passwordConfirm'] as FormGroup;
        const password = passwords.controls['password'];
        password.setValue('');
        return expect(component.form.valid).toBeFalsy();
      });

      it('should have an error if password is not entered', async () => {
        const passwords = component.form.controls['passwordConfirm'] as FormGroup;
        const password = passwords.controls['password'];
        password.setValue('');
        const errors = password.errors || {};
        return expect(errors['required']).toBeTruthy();
      });

      it('should have an error if confirmation is not entered', async () => {
        const passwords = component.form.controls['passwordConfirm'] as FormGroup;
        const confirm = passwords.controls['confirm'];
        confirm.setValue('');
        const errors = confirm.errors || {};
        return expect(errors['required']).toBeTruthy();
      });

      it('should have an error if password and confirmation are not identical', async () => {
        const passwords = component.form.controls['passwordConfirm'] as FormGroup;
        const password = passwords.controls['password'];
        password.setValue('SachIchNicht');
        const confirm = passwords.controls['confirm'];
        confirm.setValue('SagIchAuchNicht');
        const errors = confirm.errors || {};
        return expect(errors['passwordMatch']).toBeTruthy();
      });

      it('should have save button disabled if form is invalid', async () => {
        const passwords = component.form.controls['passwordConfirm'] as FormGroup;
        const password = passwords.controls['password'];
        password.setValue('');
        fixture.detectChanges();
        await expect(component.form.valid).toBeFalsy();
        const button = fixture.debugElement.query(By.css('#btn_pw_save')).nativeElement as HTMLButtonElement;
        return expect(button.disabled).toBeTruthy();
      });

      it('should invoke onSave handler when save button is pressed', async () => {
        const spy = jest.spyOn(component, 'onSave');
        fixture.debugElement.query(By.css('#btn_pw_save')).triggerEventHandler('click', component.form);
        return expect(spy).toHaveBeenCalledWith(component.form);
      });
    });

    describe(`When dialog content is edited to change the user's own password ...`, () => {

      beforeEach(async () => {
        component.data = {title: 'Mein Passwort ändern', task: 'change', user: UserFactory.fromData(mockSingleUser())};
        component.form = undefined;
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should have an error if old password is not entered', async () => {
        const oldPassword = component.form.controls['oldPassword'];
        oldPassword.setValue('');
        const errors = oldPassword.errors || {};
        return expect(errors['required']).toBeTruthy();
      });
    });
  });

  describe('Controller', () => {

    let user;

    beforeEach(() => {
      user = UserFactory.fromData(mockSingleUser());
    });


    describe('ngOnInit', () => {

      it('should invoke buildForm and patchForm', async () => {
        // @ts-ignore
        const spyBuildForm = jest.spyOn(component, 'buildForm');
        // @ts-ignore
        const spyPatchForm = jest.spyOn(component, 'patchForm');
        component.form = undefined;
        component.ngOnInit();
        await expect(spyBuildForm).toHaveBeenCalled();
        return expect(spyPatchForm).toHaveBeenCalled();
      });
    });

    describe('onSave', () => {

      it('should invoke changeObject, UserBusinessService.changePassword and MatDialogRef.close', async () => {
        const values = {
          uid: user.uid,
          email: user.email,
          oldPassword: 'SagIchNicht',
          password: 'WeissIchNicht'
        };
        // @ts-ignore
        component.changeObject = jest.fn(() => values);
        // @ts-ignore
        const spyChangeObject = jest.spyOn(component, 'changeObject');
        const spyChangePw = jest.spyOn(service, 'changePassword');
        const spyClose = jest.spyOn(dialogRef, 'close');
        component.ngOnInit();
        component.onSave(component.form);
        expect(spyChangeObject).toHaveBeenCalledWith<any>(component.form.value);
        return expect(spyClose).toHaveBeenCalled();
      });
    });
  });

  async function testForm(data: any) {

    beforeEach(async () => {
      component.data = data;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show the correct title', async () => {

      const h1 = fixture.debugElement.query(By.css('h1')).nativeElement as HTMLHeadingElement;
      let title: string;
      if (component.data.task === 'change') {
        title = 'Mein Passwort ändern';
      } else {
        title = 'Passwort setzen';
      }
      return expect(h1.textContent).toEqual(title);
    });

    it('should show all relevant fields for password change in the content area', async () => {
      let expected: number;
      if (component.data.task === 'change') {
        expected = 4;
      } else {
        expected = 3;
      }
      const count = fixture.debugElement.query(By.css('mat-dialog-content')).children.length;
      return expect(count).toEqual(expected);
    });

    it('should show the input fields for password and confirmation', async () => {
      let de: DebugElement;
      de = fixture.debugElement.query(By.css('input[formControlName="password"]'));
      await expect(de).toBeTruthy();
      de = fixture.debugElement.query(By.css('input[formControlName="confirm"]'));
      return expect(de).toBeTruthy();
    });

    it('should show / not show the input field for the old password', async () => {
      const de = fixture.debugElement.query(By.css('input[formControlName="oldPassword"]'));
      if (component.data.task === 'change') {
        return expect(de).toBeTruthy();
      } else {
        return expect(de).toBeFalsy();
      }
    });

    it('should show the save and cancel buttons', async () => {
      let de: DebugElement;
      de = fixture.debugElement.query(By.css('#btn_pw_save'));
      await expect(de).toBeTruthy();
      de = fixture.debugElement.query(By.css('#btn_pw_cancel'));
      return expect(de).toBeTruthy();
    });
  }

});
