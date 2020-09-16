import {AfterViewInit, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs/index';

export abstract class DetailsComponent<T> implements OnInit, AfterViewInit {

  @ViewChild('detailsForm', { static: false }) formComponent: any;

  task$: BehaviorSubject<string> = new BehaviorSubject('edit');

  protected constructor(protected service: any,
                        protected route: ActivatedRoute) {
    this.route.paramMap
      .subscribe(params => {
        this.initializeWithData(params.get('id'));
      });
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (!this.service.isUserAllowedToEdit()) {
      this.formComponent.form.disable();
    }
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
