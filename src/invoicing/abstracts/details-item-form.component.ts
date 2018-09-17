import {EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {I18nUtilityService} from '../../shared/i18n-utility/i18n-utility.service';
import {Subscription} from 'rxjs/index';
import {debounceTime, distinctUntilChanged} from 'rxjs/internal/operators';

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
      this.itemChanges = this.itemGroup.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
        .subscribe(changes => {
          console.log('Listening to: ', changes);
          this.processFieldChanges(changes);
        });
    } else {
      this.patchItem();
    }
  }

  ngOnDestroy(): void {
    this.itemChanges.unsubscribe();
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
      let newValue;
      if (typeof this.item[key] === 'number' && typeof changes[key] === 'string') {
        newValue = this.utility.fromLocalAmount(changes[key]);
      } else {
        newValue = changes[key];
      }
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
}
