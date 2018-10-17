import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UserDetailsDialogComponent} from './user-details-dialog.component';
import {UsersBusinessService} from '../../business-services/users-business.service';
import {UsersUiService} from '../../services';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {By} from '@angular/platform-browser';
import {User} from '../../models/user';
import {mockSingleUser} from '../../../test/factories/mock-users.factory';

describe('User Details Dialog Component', () => {

  let component: UserDetailsDialogComponent;
  let fixture: ComponentFixture<UserDetailsDialogComponent>;
  let service: UsersBusinessService;
  let uiService: UsersUiService;
  let dialogRef: MatDialogRef<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MaterialModule, FlexLayoutModule, FormsModule, ReactiveFormsModule],
      declarations: [UserDetailsDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Benutzer pflegen',
            task: 'edit',
            user: mockSingleUser()
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn()
          }
        },
        {
          provide: UsersBusinessService,
          useValue: {
            getThumbnailUrlForSize: jest.fn(() => 'any-size'),
            new: jest.fn(),
            create: jest.fn(),
            updateProfile: jest.fn(),
            deleteProfileImage: jest.fn(),
            uploadProfileImage: jest.fn()
          }
        },
        {
          provide: UsersUiService,
          useValue: {
            openPasswordChangePopup: jest.fn()
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(async () => {
    service = TestBed.get(UsersBusinessService);
    uiService = TestBed.get(UsersUiService);
    dialogRef = TestBed.get(MatDialogRef);
    fixture = TestBed.createComponent(UserDetailsDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('View', () => {

    describe('When dialog is initially displayed ...', () => {
      describe('When new user is to be created ...', () => {

        return testForm({task: 'new', title: 'Benutzer anlegen', user: User.createFromData(mockSingleUser())});

      });

      describe('When existing user is to be edited ...', () => {

        return testForm({task: 'edit', title: 'Benutzer pflegen', user: User.createFromData(mockSingleUser())});
      });

      describe('When my own profile is to be edited ...', () => {

        return testForm({task: 'my-profile', title: 'Meine Daten', user: User.createFromData(mockSingleUser())});
      });
    });

    describe('When dialog content is edited ...', () => {

      describe('When common fields are edited ...', () => {

        beforeEach(async () => {
          component.data = {task: 'edit', title: 'Benutzer pflegen', user: User.createFromData(mockSingleUser())};
          component.form = undefined;
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should be invalid when not completely filled in', async () => {
          const displayName = component.form.controls['displayName'];
          displayName.setValue('');
          return expect(component.form.valid).toBeFalsy();
        });


        it('should have an error if display name is not entered', async () => {
          const displayName = component.form.controls['displayName'];
          displayName.setValue('');
          const errors = displayName.errors || {};
          return expect(errors['required']).toBeTruthy();
        });

        it('should have an error if phone number has an invalid format', async () => {
          const phoneNumber = component.form.controls['phoneNumber'];
          phoneNumber.setValue('xyz');
          const errors = phoneNumber.errors || {};
          return expect(errors['pattern']).toBeTruthy();
        });

        it('should have an error if organization is not entered', async () => {
          const organization = component.form.controls['organization'];
          organization.setValue('');
          const errors = organization.errors || {};
          return expect(errors['required']).toBeTruthy();
        });

        it('should have an error if roles is not entered', async () => {
          const roles = component.form.controls['roles'];
          roles.setValue('');
          const errors = roles.errors || {};
          return expect(errors['required']).toBeTruthy();
        });

        it('should have all buttons except cancel disabled if form has validation errors', async () => {
          const displayName = component.form.controls['displayName'];
          displayName.setValue('');
          fixture.detectChanges();
          await expect(component.form.valid).toBeFalsy();
          const buttonDebugEls = fixture.debugElement.query(By.css('mat-dialog-actions')).children
            .filter(de => !(de.nativeElement as HTMLButtonElement).disabled);
          return expect(buttonDebugEls.length).toBe(1);
        });

        it('should have save resp. create button disabled if form is dirty', async () => {
          component.form.markAsDirty();
          await expect(component.form.valid && component.form.dirty).toBeTruthy();
          const buttonDebugEls = fixture.debugElement.query(By.css('mat-dialog-actions')).children
            .filter(de => (de.nativeElement as HTMLButtonElement).disabled);
          return expect(buttonDebugEls.length).toBe(1);
        });

        it('should invoke onUploadImage handler when upload image button is pressed', async () => {
          const spy = jest.spyOn(component, 'onUploadImage');
          fixture.debugElement.query(By.css('#btn_img_upload')).triggerEventHandler('click', component.data.user);
          return expect(spy).toHaveBeenCalledWith(component.data.user);
        });

        it('should invoke onDeleteImage handler when delete image button is pressed', async () => {
          const spy = jest.spyOn(component, 'onDeleteImage');
          fixture.debugElement.query(By.css('#btn_img_delete')).triggerEventHandler('click', component.data.user);
          return expect(spy).toHaveBeenCalledWith(component.data.user);
        });

        it('should invoke onSave handler when save button is pressed', async () => {
          const spy = jest.spyOn(component, 'onSave');
          fixture.debugElement.query(By.css('#btn_save')).triggerEventHandler('click', component.form);
          return expect(spy).toHaveBeenCalledWith(component.form);
        });

        it('should invoke onPasswordChange handler when change password button is pressed', async () => {
          const spy = jest.spyOn(component, 'onChangePassword');
          fixture.debugElement.query(By.css('#btn_changepw')).triggerEventHandler('click', component.data.user);
          return expect(spy).toHaveBeenCalledWith(component.data.user);
        });
      });

      describe('When fields for user creation are edited ...', () => {

        beforeEach(async () => {
          component.data = {task: 'new', title: 'Benutzer anlegen', user: {}};
          component.form = undefined;
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should have an error if email is not entered', async () => {
          const email = component.form.controls['email'];
          email.setValue('');
          const errors = email.errors || {};
          return expect(errors['required']).toBeTruthy();
        });

        it('should have an error if email has incorrect format', async () => {
          const email = component.form.controls['email'];
          email.setValue('wrong.at.test.de');
          const errors = email.errors || {};
          return expect(errors['email']).toBeTruthy();
        });

        it('should have an error if password and confirmed password are not identical', async () => {
          const passwords = component.form.controls['passwords'] as FormGroup;
          passwords.controls['password'].setValue('SagIchNicht');
          passwords.controls['confirm'].setValue('IchSagNix');
          const errors = passwords.errors || {};
          return expect(errors['passwordMatch']).toBeTruthy();
        });

        it('should invoke onSave handler when create button is pressed', async () => {
          const spy = jest.spyOn(component, 'onSave');
          fixture.debugElement.query(By.css('#btn_create')).triggerEventHandler('click', component.form);
          return expect(spy).toHaveBeenCalledWith(component.form);
        });
      });
    });
  });

  describe('Controller', () => {

    let user;

    beforeEach(() => {
      user = User.createFromData(mockSingleUser());
    });


    describe('ngOnInit', () => {

      it('should invoke UsersBusinessService.getThumbnailUrlForSize, buildForm and patchForm', async () => {
        const spyThumbnailUrl = jest.spyOn(service, 'getThumbnailUrlForSize');
        // @ts-ignore
        const spyBuildForm = jest.spyOn(component, 'buildForm');
        // @ts-ignore
        const spyPatchForm = jest.spyOn(component, 'patchForm');
        component.ngOnInit();
        await expect(spyThumbnailUrl).toHaveBeenCalled();
        await expect(spyBuildForm).toHaveBeenCalled();
        return expect(spyPatchForm).toHaveBeenCalled();
      });
    });

    describe('onChangePassword', () => {

      it('should invoke UsersUiService.openPasswordChangePopup', async () => {
        const spy = jest.spyOn(uiService, 'openPasswordChangePopup');
        component.onChangePassword(user);
        await expect(spy).toHaveBeenCalled();
      });
    });

    describe('onDeleteImage', () => {

      it('should invoke UsersBusinessService.deleteProfileImage', async () => {
        const spy = jest.spyOn(service, 'deleteProfileImage');
        component.onDeleteImage(user);
        await expect(spy).toHaveBeenCalledWith(user);
      });
    });

    describe('onSave', () => {

      it('should invoke changeObject and MatDialogRef.close in any case', async () => {
        // @ts-ignore
        const spyChangeObject = jest.spyOn(component, 'changeObject');
        const spyClose = jest.spyOn(dialogRef, 'close');
        await component.ngOnInit();
        component.onSave(component.form);
        await expect(spyChangeObject).toHaveBeenCalledWith(component.form.value);
        return expect(spyClose).toHaveBeenCalled();
      });

      it('should invoke UsersBusinessService.updateProfile when editing an existing user profile', async () => {
        const spy = jest.spyOn(service, 'updateProfile');
        // @ts-ignore
        component.changeObject = jest.fn(() => {
          return {user: user, password: 'SagIchNicht'};
        });
        await component.ngOnInit();
        component.onSave(component.form);
        return expect(spy).toHaveBeenCalled();
      });

      it('should invoke UsersBusinessService.create when creating a new user profile', async () => {
        const spy = jest.spyOn(service, 'create');
        // @ts-ignore
        component.changeObject = jest.fn(() => {
          const newUser = {...user, uid: undefined};
          return {user: newUser, password: 'SagIchNicht'};
        });
        await component.ngOnInit();
        component.onSave(component.form);
        return expect(spy).toHaveBeenCalled();
      });
    });

    describe('onUploadImage', () => {

      it('should invoke UsersBusinessService.uploadProfileImage', async () => {
        const spy = jest.spyOn(service, 'uploadProfileImage');
        component.onUploadImage(user);
        await expect(spy).toHaveBeenCalledWith(user);
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
      if (component.data.task === 'new') {
        title = 'Benutzer anlegen';
      } else if (component.data.task === 'edit') {
        title = 'Benutzer pflegen';
      } else {
        title = 'Meine Daten';
      }
      return expect(h1.textContent).toEqual(title);
    });

    it('should show the buttons for image upload and deletion', async () => {
      let expected: number;
      if (component.data.user.imageUrl) {
        expected = 2;
      } else {
        expected = 1;
      }
      const count = fixture.debugElement.queryAll(By.css('button.jo-user-img-upload')).length;
      return expect(count).toEqual(expected);
    });

    it('should show all relevant fields for user creation within the content area', async () => {
      let expected: number;
      if (component.data.task === 'new') {
        expected = 10;
      } else if (component.data.task === 'edit') {
        expected = 8;
      } else {
        expected = 6;
      }
      const count = fixture.debugElement.query(By.css('mat-dialog-content')).children.length;
      return expect(count).toEqual(expected);
    });

    it('should show / not show the input fields for password and password confirmation', async () => {
      let expected: number;
      if (component.data.task === 'new') {
        expected = 2;
      } else {
        expected = 0;
      }
      const count = fixture.debugElement.queryAll(By.css('input[type=password]')).length;
      return expect(count).toEqual(expected);
    });

    it('should show the checkbox for locking the user', async () => {
      let expected: number;
      if (component.data.task === 'my-profile') {
        expected = 0;
      } else {
        expected = 1;
      }
      const count = fixture.debugElement.queryAll(By.css('mat-checkbox')).length;
      return expect(count).toEqual(expected);
    });

    it('should show the correct buttons', async () => {
      let expected: number;
      if (component.data.task === 'new') {
        expected = 2;
      } else {
        expected = 3;
      }
      const count = fixture.debugElement.query(By.css('mat-dialog-actions')).children.length;
      return expect(count).toEqual(expected);
    });
  }
});


