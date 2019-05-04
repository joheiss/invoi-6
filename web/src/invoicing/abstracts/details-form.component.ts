import {EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/index';
import {MatTabChangeEvent} from '@angular/material';
import {Router} from '@angular/router';
import {I18nUtilityService} from '../../shared/i18n-utility/i18n-utility.service';
import {AppState} from '../../app/store/reducers';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app/store';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {DateUtility, DocumentLinkData, Masterdata, Transaction} from 'jovisco-domain';
import {DateTime} from 'luxon';

export abstract class DetailsFormComponent<T extends Transaction | Masterdata> implements OnInit, OnChanges, OnDestroy {
  @Input() object: T | undefined;
  @Output() copy = new EventEmitter<T>();
  @Output() changed = new EventEmitter<T>();
  @Output() new = new EventEmitter<any>();
  @Output() create = new EventEmitter<T>();
  @Output() update = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  form: FormGroup;
  changedDocumentLinks: DocumentLinkData[] = [];
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
      if (!this.form.disabled) {
        this.listenToChanges();
      }
    } else {
      this.patchForm();
    }
  }

  ngOnDestroy() {
    Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe);
  }

  onCancel(event?: Event) {
    this.store.dispatch(new fromRoot.Back());
    if (event) event.stopPropagation();
  }

  onCopy(event?: Event) {
    this.copy.emit(this.object);
    this.form.reset();
    if (event) event.stopPropagation();
  }

  onDelete(event?: Event) {
    this.delete.emit(this.object);
    if (event) event.stopPropagation();
  }

  onNew(event?: Event) {
    this.new.emit();
    this.form.reset();
    if (event) event.stopPropagation();
  }

  onSave(form: FormGroup) {
    const edited = this.changeObject(form.value);
    if (this.existsObject(edited)) {
      this.update.emit(edited);
    } else {
      this.create.emit(edited);
    }
    this.form.markAsPristine();
    // this.form.reset();
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
      if (!ctrl) return;

      this.subscriptions[controlName] = this.listenToValueChanges(ctrl, controlName, handler);
    }
  }

  protected onSimpleHeaderAmountChanged = (value: any, controlName?: string) => {
    console.log(`${controlName} changed on form: ${value}`);
    this.object.header[controlName] = this.utility.fromLocalAmount(value);
  }


  protected onSimpleHeaderDateChanged = (value: any, controlName?: string) => {
    console.log(`${controlName} changed on form: ${value}`);
    this.object.header[controlName] = DateTime.fromMillis(value.valueOf()).toJSDate();
    console.log(this.object.header[controlName]);
  }

  protected onSimpleHeaderStartDateChanged = (value: any, controlName?: string) => {
    console.log(`${controlName} changed on form: ${value}`);
    this.object.header[controlName] = DateUtility.getStartDateFromMoment(value);
    console.log(this.object.header[controlName]);
  }

  protected onSimpleHeaderEndDateChanged = (value: any, controlName?: string) => {
    console.log(`${controlName} changed on form: ${value}`);
    this.object.header[controlName] = DateUtility.getEndDateFromMoment(value);
    console.log(this.object.header[controlName]);
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

  private existsObject(object: T): boolean {
    return !!object.header.id;
  }

  private listenToValueChanges(ctrl: AbstractControl, controlName: string, handler: Function): Subscription {
    return ctrl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(change => {
      if (this.isChangeValid(ctrl)) {
        handler(change, controlName);
      }
    });
  }
}


