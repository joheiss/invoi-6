import {LoginComponent} from './login.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Store} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Login} from '../store';
import {AppState} from '../../app/store';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: Store<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, MaterialModule, FlexLayoutModule, FormsModule, ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create the component', () => {
    return expect(component).toBeTruthy();
  });

  describe('View', () => {

    describe('When view is initially displayed ...', () => {

      beforeEach(async () => {
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show the input fields for email and password', async () => {
        let de: DebugElement;
        de = fixture.debugElement.query(By.css('input[formControlName="email"]'));
        await expect(de).toBeTruthy();
        de = fixture.debugElement.query(By.css('input[formControlName="password"]'));
        return expect(de).toBeTruthy();
      });

      it('should show the login button', async () => {
        let de: DebugElement;
        de = fixture.debugElement.query(By.css('#btn_login'));
        return expect(de).toBeTruthy();
      });
    });

    describe('When view content is edited ...', () => {

      beforeEach(async () => {
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should be invalid when not completely filled in', async () => {
        const email = component.loginForm.controls['email'];
        email.setValue('');
        return expect(component.loginForm.valid).toBeFalsy();
      });

      it('should have an error if email is not entered', async () => {
        const email = component.loginForm.controls['email'];
        email.setValue('');
        const errors = email.errors || {};
        return expect(errors['required']).toBeTruthy();
      });

      it('should have an error if email has invalid format', async () => {
        const email = component.loginForm.controls['email'];
        email.setValue('ich.at.nicht.ich');
        const errors = email.errors || {};
        return expect(errors['email']).toBeTruthy();
      });

      it('should have an error if password is not entered', async () => {
        const password = component.loginForm.controls['password'];
        password.setValue('');
        const errors = password.errors || {};
        return expect(errors['required']).toBeTruthy();
      });

      it('should have save button disabled if form is invalid', async () => {
        const email = component.loginForm.controls['email'];
        email.setValue('');
        fixture.detectChanges();
        await expect(component.loginForm.valid).toBeFalsy();
        const button = fixture.debugElement.query(By.css('#btn_login')).nativeElement as HTMLButtonElement;
        return expect(button.disabled).toBeTruthy();
      });

      it('should invoke onSubmit handler when login button is pressed', async () => {
        const spy = jest.spyOn(component, 'onSubmit');
        fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
        return expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('Controller', () => {

    describe('onSubmit', async () => {

      beforeEach(async () => {
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should dispatch Login action', async () => {
        component.loginForm.controls['email'].setValue('test@test.de');
        component.loginForm.controls['password'].setValue('SagIchNicht');
        const spy = jest.spyOn(store, 'dispatch');
        const action = new Login(component.loginForm.value);
        component.onSubmit();
        return expect(spy).toHaveBeenCalledWith(action);
      });
    });
  });
});
