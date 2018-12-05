import {OnInit} from '@angular/core';
import {Observable} from 'rxjs/index';

export abstract class MasterComponent<T, V> implements OnInit {

  summaries$: Observable<V[]>;

  protected constructor(protected service: any) {}

  ngOnInit() {
    this.summaries$ = this.service.getSummary();
  }

  onCopy(object: T) {
    this.service.copy(object);
  }

  onDelete(object: T) {
    this.service.delete(object);
  }

  onNew(event?: Event) {
    this.service.new();
    if (event) event.stopPropagation();

  }
}
