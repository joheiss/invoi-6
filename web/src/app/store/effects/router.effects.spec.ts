import {Observable} from 'rxjs/index';
import {RouterEffects} from './router.effects';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Back, Forward, Go} from '../actions';
import {hot} from 'jasmine-marbles';

describe('Router Effects', () => {
  let actions: Observable<any>;
  let effects: RouterEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RouterEffects,
        provideMockActions(() => actions),
      ]
    });
    effects = TestBed.inject(RouterEffects);
  });

  it('effects should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('Go', () => {
    it('should be defined', async () => {
      const payload = { path: ['anywhere'] };
      const action = new Go(payload);
      actions = hot('-a', { a: action });
      return expect(effects.navigate$).toBeDefined();
    });
  });

  describe('Back', () => {
    it('should be defined', async () => {
      const action = new Back();
      actions = hot('-a', { a: action });
      return expect(effects.navigateBack$).toBeDefined();
    });
  });

  describe('Forward', () => {
    it('should be defined', async () => {
      const action = new Forward();
      actions = hot('-a', { a: action });
      return expect(effects.navigateForward$).toBeDefined();
    });
  });
});
