import {OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

export abstract class MasterComponent<T, V> implements OnInit {

  summaries$: Observable<V[]>;

  constructor(protected service: any) {}

  ngOnInit() {
    this.summaries$ = this.service.getSummary();
  }

  onCopy(object: T) {
    this.service.copy(object);
  }

  onDelete(object: T) {
    this.service.delete(object);
  }

  onNew() {
    this.service.new();
  }
}