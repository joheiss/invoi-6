import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UserDetailsDialogComponent} from './user-details-dialog.component';
import {UsersBusinessService} from '../../business-services/users-business.service';
import {UsersUiService} from '../../services';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {generateNewUser, generateUserProfile} from '../../../test/test-generators';
import {By} from '@angular/platform-browser';
import {User} from '../../models/user';

describe('User Details Dialog Component', () => {

  let component: UserDetailsDialogComponent;
  let fixture: ComponentFixture<UserDetailsDialogComponent>;
  let service: UsersBusinessService;
  let uiService: UsersUiService;

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
            user: generateUserProfile()
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
            updateProfile: jest.fn()
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
    fixture = TestBed.createComponent(UserDetailsDialogComponent);
    component = fixture.componentInstance;
    // component.ngOnInit();
    // fixture.whenStable().then(() => fixture.detectChanges());
  });

  it('should create the component', async () => {
    return expect(component).toBeTruthy();
  });

  describe('show user creation dialog correctly', () => {

    return testForm({task: 'new', title: 'Benutzer anlegen', user: User.createFromData(generateUserProfile())});

  });

  describe('show user maintenance dialog correctly', () => {

    return testForm({task: 'edit', title: 'Benutzer pflegen', user: User.createFromData(generateUserProfile())});
  });

  describe('show my-profile dialog correctly', () => {

    return testForm({task: 'my-profile', title: 'Meine Daten', user: User.createFromData(generateUserProfile())});
  });

  describe('Form Validations - General', () => {

    beforeEach(async () => {
      component.data = {task: 'edit', title: 'Benutzer pflegen', user: User.createFromData(generateUserProfile()) };
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

    it('should invoke onSave handler when save button is pressed', async () => {
      const spy = jest.spyOn(component, 'onSave');
      fixture.debugElement.query(By.css('#btn_save')).triggerEventHandler('click', component.form);
      return expect(spy).toHaveBeenCalledWith(component.form);
    });

    it('should invoke oPasswordChange handler when change password button is pressed', async () => {
      const spy = jest.spyOn(component, 'onChangePassword');
      fixture.debugElement.query(By.css('#btn_changepw')).triggerEventHandler('click', component.data.user);
      return expect(spy).toHaveBeenCalledWith(component.data.user);
    });
  });

  describe('Form Validations - User Creation', () => {

    beforeEach(async () => {
      component.data = {task: 'new', title: 'Benutzer anlegen', user: {} };
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

    it('should show the input fields for password and password confirmation', async () => {
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


