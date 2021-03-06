import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {I18nUtilityService} from '../../shared/i18n-utility/i18n-utility.service';
import {Subscription} from 'rxjs/index';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({ template: '' })
export abstract class DetailsItemFormComponent<T> implements OnChanges, OnDestroy {
  @Input() itemGroup: FormGroup;
  @Input() item: T;
  @Input() isChangeable: boolean;
  @Output() changed = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>();

  protected isItemGroupBuilt = false;
  protected itemChanges: Subscription;

  protected constructor(protected utility: I18nUtilityService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isItemGroupBuilt) {
      this.buildItem();
      this.patchItem();
      this.itemChanges = this.listenToValueChanges();
    } else {
      this.patchItem();
    }
  }

  ngOnDestroy(): void {
    if (this.itemChanges) {
      this.itemChanges.unsubscribe();
    }
  }

  onDelete(itemId: number) {
    this.delete.emit(itemId);
  }

  protected abstract buildItem(): void;

  protected abstract isImmediateChangeNeeded(fieldName: string): boolean;

  protected abstract patchItem(): void;

  protected processFieldChanges(changes: Object): void {
    let changed = false;
    let immediateChangeNeeded = false;
    Object.keys(changes).forEach(key => {
      const newValue = this.getChangedValue(changes, key);
      if (newValue !== this.item[key]) {
        this.itemGroup.get(key).updateValueAndValidity();
        if (this.itemGroup.get(key).valid) {
          this.item[key] = newValue;
          changed = true;
          immediateChangeNeeded = this.isImmediateChangeNeeded(key);
        }
      }
    });
    if (changed && immediateChangeNeeded) {
      this.changed.emit();
    }
  }

  private getChangedValue(changes: Object, key: string): any {
    if (typeof this.item[key] === 'number' && typeof changes[key] === 'string') {
      return this.utility.fromLocalAmount(changes[key]);
    } else {
      return changes[key];
    }
  }

  private listenToValueChanges(): Subscription {
    return this.itemGroup.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(changes => {
      this.processFieldChanges(changes);
    });
  }
}
