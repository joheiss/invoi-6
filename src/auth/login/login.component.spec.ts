import {LoginComponent} from './login.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../shared/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Store} from '@ngrx/store';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Login} from '../store/actions';
import {AppState} from '../../app/store/reducers';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: Store<AppState>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
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
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create the component', () => {
    return expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should be invalid when not completely filled in', async () => {
      return expect(component.loginForm.valid).toBeFalsy();
    });

    it('should have an error if email is not entered', async () => {
      const email = component.loginForm.controls['email'];
      const errors = email.errors || {};
      return expect(errors['required']).toBeTruthy();
    });

    it('should have an error if email has incorrect format', async () => {
      const email = component.loginForm.controls['email'];
      email.setValue('wrong.at.test.de');
      const errors = email.errors || {};
      return expect(errors['email']).toBeTruthy();
    });

    it('should have an error if password is not entered', async () => {
      const password = component.loginForm.controls['password'];
      const errors = password.errors || {};
      return expect(errors['required']).toBeTruthy();
    });
  });

  describe('Form Submit', () => {
    it('should dispatch Login action', async () => {
      component.loginForm.controls['email'].setValue('test@test.de');
      component.loginForm.controls['password'].setValue('SagIchNicht');
      const spy = jest.spyOn(store, 'dispatch');
      const action = new Login(component.loginForm.value);
      await expect(component.onSubmit()).not.toBe(true);
      return expect(spy).toHaveBeenCalledWith(action);
    });
  });
});
