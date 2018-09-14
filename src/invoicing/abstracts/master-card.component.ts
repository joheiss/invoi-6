import {EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Summary} from '../models/invoicing.model';

export abstract class MasterCardComponent<T, V extends Summary> implements OnChanges {
  @Input('summary') summary: V;
  @Output('copy') copy = new EventEmitter<T>();
  @Output('delete') delete = new EventEmitter<T>();

  ngOnChanges(changes: SimpleChanges): void {
  }

  onCopy() {
    this.copy.emit(this.summary.object);
  }

  onDelete() {
    this.delete.emit(this.summary.object);
  }
}
