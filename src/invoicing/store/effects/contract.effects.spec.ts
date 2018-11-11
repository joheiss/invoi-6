import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store/reducers';
import {ContractsService} from '../../services';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {ContractsEffects} from './contract.effects';
import {cold, hot} from 'jasmine-marbles';
import {
  CopyContractSuccess,
  CreateContract,
  CreateContractFail,
  CreateContractSuccess,
  DeleteContract,
  DeleteContractFail,
  DeleteContractSuccess,
  NewContractSuccess,
  QueryContracts,
  UpdateContract,
  UpdateContractFail,
  UpdateContractSuccess
} from '../actions';
import {mockAllContracts, mockSingleContract} from '../../../test/factories/mock-contracts.factory';
import {of} from 'rxjs/index';
import {mockAuth} from '../../../test/factories/mock-auth.factory';
import {firestore} from 'firebase';
import {Go, OpenSnackBar, StartSpinning, StopSpinning} from '../../../app/store/actions';

describe('Contract Effects', () => {

  let effects: ContractsEffects;
  let actions: Observable<any>;
  let store: Store<AppState>;
  let contractsService: ContractsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ContractsEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => of(mockAuth()[0]))
          }
        },
        {
          provide: ContractsService,
          useValue: {
            queryAll: jest.fn(() => of(mockAllContracts().slice(0, 3))),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            getMessage: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.get(ContractsEffects);
    store = TestBed.get(Store);
    contractsService = TestBed.get(ContractsService);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should be created', async () => {
    return expect(effects).toBeTruthy();
  });

  describe('queryContracts$', () => {
    it('should return an array of Contract Added actions', async () => {
      const action = new QueryContracts();
      actions = hot('-a', {a: action});
      const contracts = mockAllContracts().slice(0, 3);
      const outcome = contracts.map(c => {
        const type = 'Added';
        const payload = {doc: {id: c.id, data: jest.fn(() => c)}};
        payload.doc.data().issuedAt = firestore.Timestamp.fromDate(payload.doc.data().issuedAt);
        payload.doc.data().startDate = firestore.Timestamp.fromDate(payload.doc.data().startDate);
        payload.doc.data().endDate = firestore.Timestamp.fromDate(payload.doc.data().endDate);
        return {type, payload};
      });
      const mapped = mockAllContracts().slice(0, 3).map(c => {
        const type = '[Invoicing] Contract Added';
        return {type, payload: c};
      });
      const expected = cold('-(cde)', {c: mapped[0], d: mapped[1], e: mapped[2]});
      contractsService.queryAll = jest.fn(() => of(outcome));
      return expect(effects.queryContracts$).toBeObservable(expected);
    });
  });

  describe('updateContract$', () => {
    it('should return an UpdateContractSuccess action and dispatch StartSpinning action', async () => {
      const contract = mockSingleContract();
      const action = new UpdateContract(contract);
      actions = hot('-a', {a: action});
      const outcome = new UpdateContractSuccess(contract);
      const expected = cold('--c', {c: outcome});
      contractsService.update = jest.fn(() => cold('-b|', {b: contract}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateContract$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an UpdateContractFail action and dispatch StartSpinning action', async () => {
      const contract = mockSingleContract();
      const action = new UpdateContract(contract);
      actions = hot('-a', {a: action});
      const error = new Error('Update failed');
      const outcome = new UpdateContractFail(error);
      const expected = cold('--c', {c: outcome});
      contractsService.update = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateContract$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('updateContractSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go action', async () => {
      const contract = mockSingleContract();
      const action = new UpdateContractSuccess(contract);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
        c: new Go({path: ['/invoicing/contracts']})
      });
      return expect(effects.updateContractSuccess$).toBeObservable(expected);
    });
  });

  describe('updateContractFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Update failed');
      const action = new UpdateContractFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.updateContractFail$).toBeObservable(expected);
    });
  });

  describe('createContract$', () => {

    it('should return a CreateContractSuccess action and dispatch StartSpinning action', async () => {
      const contract = mockSingleContract();
      const newId = (+contract.id + 1).toString();
      const newContract = {...contract, id: newId};
      const action = new CreateContract(newContract);
      actions = hot('-a', {a: action});
      const outcome = new CreateContractSuccess(newContract);
      const expected = cold('--c', {c: outcome});
      contractsService.create = jest.fn(() => cold('-b|', {b: newContract}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createContract$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return a CreateContractFail action and dispatch StartSpinning action', async () => {
      const newContract = {...mockSingleContract(), id: 'Wrong'};
      const action = new CreateContract(newContract);
      actions = hot('-a', {a: action});
      const error = new Error('Create failed');
      const outcome = new CreateContractFail(error);
      const expected = cold('--c', {c: outcome});
      contractsService.create = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.createContract$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('createContractSuccess$', () => {

    it('should return an array of actions containing StopSpinning and Go action', async () => {
      const contract = mockSingleContract();
      const action = new CreateContractSuccess(contract);
      actions = hot('-a', {a: action});
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new Go({path: ['/invoicing/contracts', contract.id]})
      });
      return expect(effects.createContractSuccess$).toBeObservable(expected);
    });
  });

  describe('createContractFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Create failed');
      const action = new CreateContractFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.createContractFail$).toBeObservable(expected);
    });
  });

  describe('deleteContract$', () => {
    it('should return an DeleteContractSuccess action', async () => {
      const contract = mockSingleContract();
      const action = new DeleteContract(contract);
      actions = hot('-a', {a: action});
      const outcome = new DeleteContractSuccess(contract);
      const expected = cold('--c', {c: outcome});
      contractsService.delete = jest.fn(() => cold('-b|', {b: contract}));
      return expect(effects.deleteContract$).toBeObservable(expected);
    });

    it('should return an DeleteContractFail action ', async () => {
      const contract = mockSingleContract();
      const action = new DeleteContract(contract);
      actions = hot('-a', {a: action});
      const error = new Error('Delete failed');
      const outcome = new DeleteContractFail(error);
      const expected = cold('--c', {c: outcome});
      contractsService.delete = jest.fn(() => cold('-#|', {}, error));
      return expect(effects.deleteContract$).toBeObservable(expected);
    });
  });

  describe('deleteContractSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenSnackBar and Go action', async () => {
      const contract = mockSingleContract();
      const action = new DeleteContractSuccess(contract);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
        c: new Go({path: ['/invoicing/contracts']})
      });
      return expect(effects.deleteContractSuccess$).toBeObservable(expected);
    });
  });

  describe('deleteContractFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Delete failed');
      const action = new DeleteContractFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.deleteContractFail$).toBeObservable(expected);
    });
  });

  describe('copyContractSuccess$', () => {

    it('should return a Go action', async () => {
      const contract = mockSingleContract();
      const action = new CopyContractSuccess(contract);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new Go({path: ['/invoicing/contracts', 'copy']})
      });
      return expect(effects.copyContractSuccess$).toBeObservable(expected);
    });
  });

  describe('newContractSuccess$', () => {

    it('should return a Go action', async () => {
      const contract = mockSingleContract();
      const action = new NewContractSuccess(contract);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new Go({path: ['/invoicing/contracts', 'new']})
      });
      return expect(effects.newContractSuccess$).toBeObservable(expected);
    });
  });
});
