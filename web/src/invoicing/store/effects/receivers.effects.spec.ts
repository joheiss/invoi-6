import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/reducers';
import {ReceiversService} from '../../services';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {ReceiversEffects} from './receivers.effects';
import {cold, hot} from 'jasmine-marbles';
import {
  CopyReceiverSuccess,
  CreateReceiver,
  CreateReceiverFail,
  CreateReceiverSuccess,
  DeleteReceiver,
  DeleteReceiverFail,
  DeleteReceiverSuccess,
  NewReceiverSuccess,
  QueryReceivers,
  UpdateReceiver,
  UpdateReceiverFail,
  UpdateReceiverSuccess
} from '../actions';
import {mockAllReceivers, mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {Go, OpenSnackBar, StartSpinning, StopSpinning} from '../../../app/store/actions';

describe('Receiver Effects', () => {

  let effects: ReceiversEffects;
  let actions: Observable<any>;
  let store: Store<AppState>;
  let receiversService: ReceiversService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ReceiversEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => of(mockAuth()[0]))
          }
        },
        {
          provide: ReceiversService,
          useValue: {
            queryAll: jest.fn(() => of(mockAllReceivers())),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            getMessage: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.get(ReceiversEffects);
    store = TestBed.get(Store);
    receiversService = TestBed.get(ReceiversService);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should be created', async () => {
    return expect(effects).toBeTruthy();
  });

  describe('queryReceivers$', () => {
    it('should return an array of Receiver Added actions', async () => {
      const action = new QueryReceivers();
      actions = hot('-a', {a: action});
      const receivers = mockAllReceivers();
      const outcome = receivers.map(r => {
        const type = 'Added';
        const payload = {doc: {id: r.id, data: jest.fn(() => r)}};
        return {type, payload};
      });
      const mapped = mockAllReceivers().map(r => {
        const type = '[Invoicing] Receiver Added';
        return {type, payload: r};
      });
      const expected = cold('-(cd)', {c: mapped[0], d: mapped[1]});
      receiversService.queryAll = jest.fn(() => of(outcome));
      return expect(effects.queryReceivers$).toBeObservable(expected);
    });
  });

  describe('updateReceiver$', () => {
    it('should return an UpdateReceiverSuccess action and dispatch StartSpinning action', async () => {
      const receiver = mockSingleReceiver();
      const action = new UpdateReceiver(receiver);
      actions = hot('-a', {a: action});
      const outcome = new UpdateReceiverSuccess(receiver);
      const expected = cold('--c', {c: outcome});
      receiversService.update = jest.fn(() => cold('-b|', {b: receiver}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateReceiver$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an UpdateReceiverFail action and dispatch StartSpinning action', async () => {
      const receiver = mockSingleReceiver();
      const action = new UpdateReceiver(receiver);
      actions = hot('-a', {a: action});
      const error = new Error('Update failed');
      const outcome = new UpdateReceiverFail(error);
      const expected = cold('--c', {c: outcome});
      receiversService.update = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateReceiver$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('updateReceiverSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go action', async () => {
      const receiver = mockSingleReceiver();
      const action = new UpdateReceiverSuccess(receiver);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
        c: new Go({path: ['/invoicing/receivers']})
      });
      return expect(effects.updateReceiverSuccess$).toBeObservable(expected);
    });
  });

  describe('updateReceiverFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Update failed');
      const action = new UpdateReceiverFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.updateReceiverFail$).toBeObservable(expected);
    });
  });

  describe('createReceiver$', () => {

    it('should return a CreateReceiverSuccess action and dispatch StartSpinning action', async () => {
      const receiver = mockSingleReceiver();
      const newId = (+receiver.id + 1).toString();
      const newReceiver = {...receiver, id: newId};
      const action = new CreateReceiver(newReceiver);
      actions = hot('-a', {a: action});
      const outcome = new CreateReceiverSuccess(newReceiver);
      const expected = cold('--c', {c: outcome});
      receiversService.create = jest.fn(() => cold('-b|', {b: newReceiver}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createReceiver$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return a CreateReceiverFail action and dispatch StartSpinning action', async () => {
      const newReceiver = {...mockSingleReceiver(), id: 'Wrong'};
      const action = new CreateReceiver(newReceiver);
      actions = hot('-a', {a: action});
      const error = new Error('Create failed');
      const outcome = new CreateReceiverFail(error);
      const expected = cold('--c', {c: outcome});
      receiversService.create = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createReceiver$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('createReceiverSuccess$', () => {

    it('should return an array of actions containing StopSpinning and Go action', async () => {
      const receiver = mockSingleReceiver();
      const action = new CreateReceiverSuccess(receiver);
      actions = hot('-a', {a: action});
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new Go({path: ['/invoicing/receivers', receiver.id]})
      });
      return expect(effects.createReceiverSuccess$).toBeObservable(expected);
    });
  });

  describe('createReceiverFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Create failed');
      const action = new CreateReceiverFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.createReceiverFail$).toBeObservable(expected);
    });
  });

  describe('deleteReceiver$', () => {
    it('should return an DeleteReceiverSuccess action', async () => {
      const receiver = mockSingleReceiver();
      const action = new DeleteReceiver(receiver);
      actions = hot('-a', {a: action});
      const outcome = new DeleteReceiverSuccess(receiver);
      const expected = cold('--c', {c: outcome});
      receiversService.delete = jest.fn(() => cold('-b|', {b: receiver}));
      return expect(effects.deleteReceiver$).toBeObservable(expected);
    });

    it('should return an DeleteReceiverFail action ', async () => {
      const receiver = mockSingleReceiver();
      const action = new DeleteReceiver(receiver);
      actions = hot('-a', {a: action});
      const error = new Error('Delete failed');
      const outcome = new DeleteReceiverFail(error);
      const expected = cold('--c', {c: outcome});
      receiversService.delete = jest.fn(() => cold('-#|', {}, error));
      return expect(effects.deleteReceiver$).toBeObservable(expected);
    });
  });

  describe('deleteReceiverSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go action', async () => {
      const receiver = mockSingleReceiver();
      const action = new DeleteReceiverSuccess(receiver);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
        c: new Go({path: ['/invoicing/receivers']})
      });
      return expect(effects.deleteReceiverSuccess$).toBeObservable(expected);
    });
  });

  describe('deleteReceiverFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Delete failed');
      const action = new DeleteReceiverFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.deleteReceiverFail$).toBeObservable(expected);
    });
  });

  describe('copyReceiverSuccess$', () => {

    it('should return a Go action', async () => {
      const receiver = mockSingleReceiver();
      const action = new CopyReceiverSuccess(receiver);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new Go({path: ['/invoicing/receivers', 'copy']})
      });
      return expect(effects.copyReceiverSuccess$).toBeObservable(expected);
    });
  });

  describe('newReceiverSuccess$', () => {

    it('should return a Go action', async () => {
      const receiver = mockSingleReceiver();
      const action = new NewReceiverSuccess(receiver);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new Go({path: ['/invoicing/receivers', 'new']})
      });
      return expect(effects.newReceiverSuccess$).toBeObservable(expected);
    });
  });
});
