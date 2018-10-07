import {BehaviorSubject} from 'rxjs/index';
import {Observable} from 'rxjs/index';

export class TestStore<T> {
  private state: BehaviorSubject<T> = new BehaviorSubject(undefined);

  setState(data: T): void {
    this.state.next(data);
  }

  select(selector?: any): Observable<T> {
    return this.state.asObservable();
  }

  dispatch(action: any) {}
}
