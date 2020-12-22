import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store';
import {NumberRangesService} from '../../services';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold, hot} from 'jasmine-marbles';
import {QueryNumberRanges, UpdateNumberRange, UpdateNumberRangeSuccess} from '../actions';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {NumberRangesEffects} from './number-ranges.effects';
import {mockAllNumberRanges} from '../../../test/factories/mock-number-ranges.factory';
import {DocumentChangeAction} from '@angular/fire/firestore';

describe('Number Ranges Effects', () => {

  let effects: NumberRangesEffects;
  let actions: Observable<any>;
  let store: Store<AppState>;
  let numberRangesService: NumberRangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NumberRangesEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => of(mockAuth()[0]))
          }
        },
        {
          provide: NumberRangesService,
          useValue: {
            queryAll: jest.fn(() => of(mockAllNumberRanges())),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            getMessage: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.inject(NumberRangesEffects);
    store = TestBed.inject(Store);
    numberRangesService = TestBed.inject(NumberRangesService);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should be created', async () => {
    return expect(effects).toBeTruthy();
  });

  describe('queryNumberRanges$', () => {
    it('should return an array of Number Ranges Added actions', async () => {
      const action = new QueryNumberRanges();
      actions = hot('-a', {a: action});
      const outcome = mockAllNumberRanges().slice(0, 3).map(nr => {
        const type = 'Added';
        const payload = {doc: {id: nr.id, data: jest.fn(() => nr)}};
        return {type, payload};
      });
      const mapped = mockAllNumberRanges().slice(0, 3).map(nr => {
        const type = '[Invoicing] Number Range Added';
        return {type, payload: nr};
      });
      const expected = cold('-(cde)', {c: mapped[0], d: mapped[1], e: mapped[2]});
      // @ts-ignore
      numberRangesService.queryAll = jest.fn(() => of(outcome));
      return expect(effects.queryNumberRanges$).toBeObservable(expected);
    });
  });

  describe('updateNumberRange$', () => {
    it('should return an UpdateNumberRangeSuccess action ', async () => {
      const numberRange = mockAllNumberRanges()[0];
      const action = new UpdateNumberRange(numberRange.id, numberRange);
      actions = hot('-a', {a: action});
      const outcome = new UpdateNumberRangeSuccess();
      const expected = cold('--c', {c: outcome});
      numberRangesService.update = jest.fn(() => cold('-b|', {b: numberRange}));
      return expect(effects.updateNumberRange$).toBeObservable(expected);
    });

  });

});
