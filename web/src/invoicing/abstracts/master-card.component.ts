import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Summary} from 'jovisco-domain';

@Component({ template: '' })
export abstract class MasterCardComponent<T, V extends Summary> implements OnChanges {
  @Input() summary: V;
  @Output() copy = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  ngOnChanges(changes: SimpleChanges): void {
  }

  onCopy() {
    this.copy.emit(this.summary.object);
  }

  onDelete() {
    this.delete.emit(this.summary.object);
  }
}
