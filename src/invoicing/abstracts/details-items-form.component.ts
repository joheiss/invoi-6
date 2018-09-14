import {Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {Transaction, TransactionItem} from '../models/transaction';

export abstract class DetailsItemsFormComponent<T extends Transaction> implements OnChanges {
  @Input('itemsFormArray') itemsFormArray: FormArray;
  @Input('object') object: T;
  @Input('isChangeable') isChangeable: boolean;

  constructor(protected service: any) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.buildItems(this.object.items);
  }

  onAdd(): void {
    this.service.addItem(this.object);
  }

  onChanged() {
    this.service.change(this.object);
  }

  onDelete(itemId: number) {
    this.service.removeItem(this.object, itemId);
    this.itemsFormArray.markAsDirty();
  }

  private buildItems(items: TransactionItem[]) {
    while (this.itemsFormArray.length > 0) {
      this.itemsFormArray.removeAt(0);
    }
    items.forEach(item => this.itemsFormArray.push(new FormGroup({})));
  }
}
