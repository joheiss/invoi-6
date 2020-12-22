import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store';
import {SettingsService} from '../../services';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {SettingsEffects} from './settings.effects';
import {cold, hot} from 'jasmine-marbles';
import {
  CopySettingSuccess,
  CreateSetting,
  CreateSettingFail,
  CreateSettingSuccess,
  DeleteSetting,
  DeleteSettingFail,
  DeleteSettingSuccess,
  NewSettingSuccess,
  QuerySettings,
  UpdateSetting,
  UpdateSettingFail,
  UpdateSettingSuccess
} from '../actions';
import {mockAllCountries, mockAllSettings} from '../../../test/factories/mock-settings.factory';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {Go, OpenSnackBar, StartSpinning, StopSpinning} from '../../../app/store';
import firebase from 'firebase/app';
import {DocumentChangeAction} from '@angular/fire/firestore';

describe('Settings Effects', () => {

  let effects: SettingsEffects;
  let actions: Observable<any>;
  let store: Store<AppState>;
  let settingsService: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SettingsEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => of(mockAuth()[0]))
          }
        },
        {
          provide: SettingsService,
          useValue: {
            queryAll: jest.fn(() => of(mockAllSettings())),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            getMessage: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.inject(SettingsEffects);
    store = TestBed.inject(Store);
    settingsService = TestBed.inject(SettingsService);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should be created', async () => {
    return expect(effects).toBeTruthy();
  });

  describe('querySettings$', () => {
    it('should return an array of Setting Added actions', async () => {
      const action = new QuerySettings();
      actions = hot('-a', {a: action});
      const settings = mockAllSettings();
      const outcome = settings.map(s => {
        s.values = s.values.map(v => {
          if (v.validFrom) {
            v.validFrom = firebase.firestore.Timestamp.fromDate(v.validFrom);
          }
          if (v.validTo) {
            v.validTo = firebase.firestore.Timestamp.fromDate(v.validTo);
          }
          return v;
        }) as DocumentChangeAction<any>[];
        const type = 'Added';
        const payload = {doc: {id: s.id, data: jest.fn(() => s)}};
        return {type, payload};
      });
      const mapped = mockAllSettings().map(s => {
        const type = '[Invoicing] Setting Added';
        return {type, payload: s};
      });
      const expected = cold('-(cd)', {c: mapped[0], d: mapped[1]});
      settingsService.queryAll = jest.fn(() => of(outcome));
      return expect(effects.querySettings$).toBeObservable(expected);
    });
  });

  describe('updateSetting$', () => {
    it('should return an UpdateSettingSuccess action and dispatch StartSpinning action', async () => {
      const setting = mockAllCountries();
      const action = new UpdateSetting(setting);
      actions = hot('-a', {a: action});
      const outcome = new UpdateSettingSuccess(setting);
      const expected = cold('--c', {c: outcome});
      settingsService.update = jest.fn(() => cold('-b|', {b: setting}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateSetting$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an UpdateSettingFail action and dispatch StartSpinning action', async () => {
      const setting = mockAllCountries();
      const action = new UpdateSetting(setting);
      actions = hot('-a', {a: action});
      const error = new Error('Update failed');
      const outcome = new UpdateSettingFail(error);
      const expected = cold('--c', {c: outcome});
      settingsService.update = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateSetting$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('updateSettingSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go action', async () => {
      const setting = mockAllCountries();
      const action = new UpdateSettingSuccess(setting);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
      });
      return expect(effects.updateSettingSuccess$).toBeObservable(expected);
    });
  });

  describe('updateSettingFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Update failed');
      const action = new UpdateSettingFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.updateSettingFail$).toBeObservable(expected);
    });
  });

  describe('createSetting$', () => {

    it('should return a CreateSettingSuccess action and dispatch StartSpinning action', async () => {
      const newSetting = mockAllCountries();
      const action = new CreateSetting(newSetting);
      actions = hot('-a', {a: action});
      const outcome = new CreateSettingSuccess(newSetting);
      const expected = cold('--c', {c: outcome});
      settingsService.create = jest.fn(() => cold('-b|', {b: newSetting}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createSetting$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return a CreateSettingFail action and dispatch StartSpinning action', async () => {
      const newSetting = mockAllCountries();
      const action = new CreateSetting(newSetting);
      actions = hot('-a', {a: action});
      const error = new Error('Create failed');
      const outcome = new CreateSettingFail(error);
      const expected = cold('--c', {c: outcome});
      settingsService.create = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createSetting$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('createSettingSuccess$', () => {

    it('should return an array of actions containing StopSpinning and Go action', async () => {
      const setting = mockAllCountries();
      const action = new CreateSettingSuccess(setting);
      actions = hot('-a', {a: action});
      // const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new Go({path: ['/invoicing/settings', 'countries']})
      });
      return expect(effects.createSettingSuccess$).toBeObservable(expected);
    });
  });

  describe('createSettingFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Create failed');
      const action = new CreateSettingFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.createSettingFail$).toBeObservable(expected);
    });
  });

  describe('deleteSetting$', () => {
    it('should return an DeleteSettingSuccess action', async () => {
      const setting = mockAllCountries();
      const action = new DeleteSetting(setting);
      actions = hot('-a', {a: action});
      const outcome = new DeleteSettingSuccess(setting);
      const expected = cold('--c', {c: outcome});
      settingsService.delete = jest.fn(() => cold('-b|', {b: setting}));
      return expect(effects.deleteSetting$).toBeObservable(expected);
    });

    it('should return an DeleteSettingFail action ', async () => {
      const setting = mockAllCountries();
      const action = new DeleteSetting(setting);
      actions = hot('-a', {a: action});
      const error = new Error('Delete failed');
      const outcome = new DeleteSettingFail(error);
      const expected = cold('--c', {c: outcome});
      settingsService.delete = jest.fn(() => cold('-#|', {}, error));
      return expect(effects.deleteSetting$).toBeObservable(expected);
    });
  });

  describe('deleteSettingSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go action', async () => {
      const setting = mockAllCountries();
      const action = new DeleteSettingSuccess(setting);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.deleteSettingSuccess$).toBeObservable(expected);
    });
  });

  describe('deleteSettingFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Delete failed');
      const action = new DeleteSettingFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.deleteSettingFail$).toBeObservable(expected);
    });
  });

  describe('copySettingSuccess$', () => {

    it('should return a Go action', async () => {
      const setting = mockAllCountries();
      const action = new CopySettingSuccess(setting);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new Go({path: ['/invoicing/settings', 'copy']})
      });
      return expect(effects.copySettingSuccess$).toBeObservable(expected);
    });
  });

  describe('newSettingSuccess$', () => {

    it('should return a Go action', async () => {
      const setting = mockAllCountries();
      const action = new NewSettingSuccess(setting);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new Go({path: ['/invoicing/settings', 'new']})
      });
      return expect(effects.newSettingSuccess$).toBeObservable(expected);
    });
  });
});
