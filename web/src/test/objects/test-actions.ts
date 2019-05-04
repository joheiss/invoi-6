import {Actions} from '@ngrx/effects';
import {EMPTY, Observable} from 'rxjs/index';
import {Action} from '@ngrx/store';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }
  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

export class TestAction implements Action {
  readonly type = '[test] Test Action';
  constructor(public payload: string) {}
}
