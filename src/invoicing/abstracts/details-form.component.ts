import {EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/index';
import {MatTabChangeEvent} from '@angular/material';
import {Router} from '@angular/router';
import {Transaction} from '../models/transaction';
import {I18nUtilityService} from '../../shared/i18n-utility/i18n-utility.service';
import {MasterData} from '../models/master-data';
import {AppState} from '../../app/store/reducers';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app/store';
import {DocumentLink} from '../models/document-link';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

export abstract class DetailsFormComponent<T extends Transaction | MasterData> implements OnInit, OnChanges, OnDestroy {
  @Input() object: T | undefined;
  @Output() copy = new EventEmitter<T>();
  @Output() changed = new EventEmitter<T>();
  @Output() new = new EventEmitter<any>();
  @Output() create = new EventEmitter<T>();
  @Output() update = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  form: FormGroup;
  changedDocumentLinks: DocumentLink[] = [];
  tabIndex = 0;

  protected subscriptions: { [name: string]: Subscription } = {};

  protected constructor(protected fb: FormBuilder,
                        protected store: Store<AppState>,
                        protected router: Router,
                        protected utility?: I18nUtilityService) {
  }

  ngOnInit(): void {
    this.changedDocumentLinks = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.form = this.buildForm();
      this.patchForm();
      this.listenToChanges();
    } else {
      this.patchForm();
    }
  }

  ngOnDestroy() {
    Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe);
  }

  onCancel() {
    this.store.dispatch(new fromRoot.Back());
  }

  onCopy() {
    this.copy.emit(this.object);
    this.form.reset();
  }

  onDelete() {
    this.delete.emit(this.object);
  }

  onNew() {
    this.new.emit();
    this.form.reset();
  }

  onSave(form: FormGroup) {
    const edited = this.changeObject(form.value);
    if (edited.header.id) {
      // update
      this.update.emit(edited);
    } else {
      // create
      this.create.emit(edited);
    }
    this.form.reset();
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
  }

  abstract getFormTitle(): string;

  hasError(fields: string[]) {
    return fields
      .map(field => this.form.get(field).invalid)
      .some(error => error === true);
  }

  protected isChangeValid(ctrl: AbstractControl) {
    ctrl.updateValueAndValidity();
    return ctrl.valid;
  }

  protected abstract buildForm(): FormGroup;

  protected abstract changeObject(values: any): T | undefined;

  protected abstract listenToChanges();

  protected listenToFieldChanges(controlName: string, handler: Function) {
    if (!this.subscriptions[controlName]) {
      const ctrl = this.form.get(controlName);
      if (!ctrl) {
        return;
      }
      const subscription = ctrl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
        .subscribe(change => {
          if (this.isChangeValid(ctrl)) {
            handler(change, controlName);
          }
        });
      this.subscriptions[controlName] = subscription;
    }
  }

  protected onSimpleHeaderAmountChanged = (value: any, controlName?: string) => {
    console.log(`${controlName} changed on form: ${value}`);
    this.object.header[controlName] = this.utility.fromLocalAmount(value);
  }

  protected onSimpleHeaderDateChanged = (value: any, controlName?: string) => {
    console.log(`${controlName} changed on form: ${value}`);
    this.object.header[controlName] = value;
  }

  protected onSimpleHeaderTextChanged = (value: any, controlName?: string) => {
    console.log(`${controlName} changed on form: ${value}`);
    this.object.header[controlName] = value;
  }

  protected onSimpleHeaderNumberChanged = (value: any, controlName?: string) => {
    console.log(`${controlName} changed on form: ${value}`);
    this.object.header[controlName] = +value;
  }

  protected onSimpleHeaderPercentageChanged = (value: any, controlName?: string) => {
    console.log(`${controlName} changed on form: ${value}`);
    this.object.header[controlName] = this.utility.fromLocalPercent(value);
  }

  protected abstract patchForm();

}


