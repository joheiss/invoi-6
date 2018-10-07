import {EMPTY, Observable, of} from 'rxjs/index';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {UiEffects} from './ui.effects';
import {UiService} from '../../../shared/services/ui.service';
import {OpenConfirmationDialog, OpenSnackBar, OpenUrl} from '../actions';
import {cold, hot} from 'jasmine-marbles';
import {TestAction} from '../../../test/test-actions';

describe('Ui Effects', () => {
  let actions: Observable<any>;
  let effects: UiEffects;
  let service: UiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UiEffects,
        provideMockActions(() => actions),
        {
          provide: UiService,
          useValue: {
            openSnackBar: jest.fn(),
            openUrl: jest.fn(),
            openConfirmationDialog: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.get(UiEffects);
    service = TestBed.get(UiService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('OpenSnackBar', () => {
    it('should invoke UiService to open snackbar', async () => {
      const payload = {message: {text: 'test'}};
      const action = new OpenSnackBar(payload);
      actions = hot('-a', {a: action});
      service.openSnackBar = jest.fn();
      return expect(effects.openSnackBar$).toBeDefined();
    });
  });

  describe('OpenUrl', () => {
    it('should invoke UiService to open URL', async () => {
      const payload = `http://any.url.any`;
      const action = new OpenUrl(payload);
      actions = hot('-a', { a: action });
      service.openUrl = jest.fn();
      return expect(effects.openSnackBar$).toBeDefined();
    });
  });

  describe('OpenConfirmationDialog', () => {
    it('should invoke UiService to open confirmation dialog and return Do-Action on confirmation', async () => {
      const payload = {
        do: new TestAction('do action'),
        title: 'Testing ...'
      };
      const action = new OpenConfirmationDialog(payload);
      actions = hot('-a', { a: action });
      const outcome = payload.do;
      const response = cold('-a|', { a: { ...payload, reply: true } });
      const expected = cold('--b', { b: outcome });
      service.openConfirmationDialog = jest.fn(() => response);
      return expect(effects.openConfirmationDialog$).toBeObservable(expected);
    });

    it('should invoke UiService to open confirmation dialog and return nothing on cancellation', async () => {
      const payload = {
        do: new TestAction('do action'),
        title: 'Testing ...'
      };
      const action = new OpenConfirmationDialog(payload);
      actions = hot('-a', { a: action });
      const response = cold('-a|', { a: { ...payload, reply: false } });
      service.openConfirmationDialog = jest.fn(() => response);
      return expect(effects.openConfirmationDialog$).toBeDefined();
    });
  });

});
