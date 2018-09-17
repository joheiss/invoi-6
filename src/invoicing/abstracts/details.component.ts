import {OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

export abstract class DetailsComponent<T> implements OnInit {

  task: string;

  protected constructor(protected service: any,
                        protected route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => this.initializeWithData(params.get('id')));
  }

  onChanged(object: T) {
    this.service.change(object);
  }

  onCreate(object: T) {
    this.service.create(object);
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

  onUpdate(object: T) {
    this.service.update(object);
  }

  protected abstract getTitle(object: T): string;
  protected abstract initializeWithData(params: string): void;
}
