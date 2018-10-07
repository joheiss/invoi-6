import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as fromRoot from '../../app/store/index';
import {Store} from '@ngrx/store';
import * as fromStore from '../store';

@Component({
  selector: 'jo-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private store: Store<fromRoot.AppState>) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  onSubmit() {
    this.store.dispatch(new fromStore.Login(this.loginForm.value));
  }
}
