import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as fromRoot from '../../app/store/index';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as fromStore from '../store';

@Component({
  selector: 'jo-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isSpinning$: Observable<boolean>;

  constructor(private store: Store<fromRoot.AppState>) {}

  ngOnInit() {
    this.isSpinning$ = this.store.select(fromRoot.selectIsSpinning);
    /*
    this.loadingSubscription = this.uiService.loading$
      .subscribe(isLoading => this.isLoading = isLoading);
    */
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  ngOnDestroy(): void {
    // this.loadingSubscription.unsubscribe();
  }

  onSubmit() {
    this.store.dispatch(new fromStore.Login(this.loginForm.value));
  }
}
