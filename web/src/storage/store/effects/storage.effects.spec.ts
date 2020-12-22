import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app/store';
import {StorageApiService, StorageUiService} from '../../services';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold, hot} from 'jasmine-marbles';
import {
  DeleteFile,
  DeleteFileFail,
  DeleteFileSuccess,
  DownloadFile,
  DownloadFileFail,
  DownloadFileSuccess,
  GetMetadataFile,
  GetMetadataFileFail,
  GetMetadataFileSuccess,
  UpdateMetadataFile,
  UpdateMetadataFileFail,
  UpdateMetadataFileSuccess,
  UploadFile, UploadFileFail, UploadFileSuccess, UploadImage, UploadImageFail, UploadImageSuccess
} from '../actions';
import {OpenSnackBar, OpenUrl, StartSpinning, StopSpinning} from '../../../app/store';
import {StorageEffects} from './storage.effects';
import {of} from 'rxjs/index';

describe('Storage Effects', () => {

  let effects: StorageEffects;
  let actions: Observable<any>;
  let store: Store<AppState>;
  let uiService: StorageUiService;
  let apiService: StorageApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        StorageEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn()
          }
        },
        {
          provide: StorageApiService,
          useValue: {
           delete: jest.fn(),
            download: jest.fn(),
            getMetadata: jest.fn(),
            updateMetadata: jest.fn(),
            upload: jest.fn(),
            getMessage: jest.fn()
          }
        },
        {
          provide: StorageUiService,
          useValue: {
            openImageUploadPopup: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.inject(StorageEffects);
    store = TestBed.inject(Store);
    uiService = TestBed.inject(StorageUiService);
    apiService = TestBed.inject(StorageApiService);

    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should be created', async () => {
    return expect(effects).toBeTruthy();
  });

  describe('deleteFile$', () => {
    it('should return a DeleteFileSuccess action and dispatch StartSpinning action', async () => {
      const payload = 'anything';
      const action = new DeleteFile(payload);
      actions = hot('-a', {a: action});
      const path = 'any path';
      const outcome = new DeleteFileSuccess(payload);
      const expected = cold('--c', {c: outcome});
      apiService.delete = jest.fn(() => cold('-b|', {b: path}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.deleteFile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an UpdateContractFail action and dispatch StartSpinning action', async () => {
      const payload = 'anything';
      const action = new DeleteFile(payload);
      actions = hot('-a', {a: action});
      const error = new Error('Delete failed');
      const outcome = new DeleteFileFail(error);
      const expected = cold('--c', {c: outcome});
      apiService.delete = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.deleteFile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('deleteFileSuccess$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const path = 'any path';
      const action = new DeleteFileSuccess(path);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
      });
      return expect(effects.deleteFileSuccess$).toBeObservable(expected);
    });
  });

  describe('deleteFileFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Delete failed');
      const action = new DeleteFileFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.deleteFileFail$).toBeObservable(expected);
    });
  });

  describe('downloadFile$', () => {
    it('should return a DownloadFileSuccess action and dispatch StartSpinning action', async () => {
      const path = 'any-path';
      const downloadUrl = 'any-url';
      const action = new DownloadFile(path);
      actions = hot('-a', {a: action});
      const outcome = new DownloadFileSuccess({ path: path, downloadUrl: downloadUrl});
      const expected = cold('--c', {c: outcome});
      apiService.download = jest.fn(() => cold('-b|', {b: downloadUrl }));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.downloadFile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an DownloadFileFail action and dispatch StartSpinning action', async () => {
      const payload = { downloadUrl: 'any url' };
      const action = new DownloadFile(payload);
      actions = hot('-a', {a: action});
      const error = new Error('Download failed');
      const outcome = new DownloadFileFail(error);
      const expected = cold('--c', {c: outcome});
      apiService.download = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.downloadFile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('downloadFileSuccess$', () => {

    it('should return an array of actions containing StopSpinning, OpenUrl and OpenSnackBar action', async () => {
      const path = 'any-path';
      const downloadUrl = 'any-url';
      const action = new DownloadFileSuccess({ path: path, downloadUrl: downloadUrl});
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(abc)', {
        a: new StopSpinning(),
        b: new OpenUrl(downloadUrl),
        c: new OpenSnackBar({message}),
      });
      return expect(effects.downloadFileSuccess$).toBeObservable(expected);
    });
  });

  describe('downloadFileFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Download failed');
      const action = new DownloadFileFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.downloadFileFail$).toBeObservable(expected);
    });
  });

  describe('getMetadataFile$', () => {
    it('should return a getMetadataFileSuccess action and dispatch StartSpinning action', async () => {
      const path = 'any-path';
      const metadata = {};
      const action = new GetMetadataFile(path);
      actions = hot('-a', {a: action});
      const outcome = new GetMetadataFileSuccess(metadata);
      const expected = cold('--c', {c: outcome});
      apiService.getMetadata = jest.fn(() => cold('-b|', {b: metadata}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.getMetadataFile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an getMetadataFileFail action and dispatch StartSpinning action', async () => {
      const path = 'any-path';
      const action = new GetMetadataFile(path);
      actions = hot('-a', {a: action});
      const error = new Error('Delete failed');
      const outcome = new GetMetadataFileFail(error);
      const expected = cold('--c', {c: outcome});
      apiService.getMetadata = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.getMetadataFile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('getMetadataFileSuccess$', () => {

    it('should return an array of actions containing StopSpinning action', async () => {
      const metadata = {};
      const action = new GetMetadataFileSuccess(metadata);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new StopSpinning(),
      });
      return expect(effects.getMetadataFileSuccess$).toBeObservable(expected);
    });
  });

  describe('getMetadataFileFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('GetMetadata failed');
      const action = new GetMetadataFileFail(error);
      actions = hot('-a', {a: action});
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message: error.message as any})
      });
      return expect(effects.getMetadataFileFail$).toBeObservable(expected);
    });
  });

  describe('updateMetadataFile$', () => {
    it('should return an updateMetadataFileSuccess action and dispatch StartSpinning action', async () => {
      const payload = { path: 'any-path', metadata: {} };
      const action = new UpdateMetadataFile(payload);
      actions = hot('-a', {a: action});
      const outcome = new UpdateMetadataFileSuccess({});
      const expected = cold('--c', {c: outcome});
      apiService.updateMetadata = jest.fn(() => cold('-b|', {b: {}}));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateMetadataFile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an updateMetadataFileFail action and dispatch StartSpinning action', async () => {
      const payload = { path: 'any-path', metadata: {} };
      const action = new UpdateMetadataFile(payload);
      actions = hot('-a', {a: action});
      const error = new Error('Delete failed');
      const outcome = new UpdateMetadataFileFail(error);
      const expected = cold('--c', {c: outcome});
      apiService.updateMetadata = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.updateMetadataFile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('updateMetadataFileSuccess$', () => {

    it('should return an array of actions containing StopSpinning action', async () => {
      const metadata = { path: 'any-path' };
      const action = new UpdateMetadataFileSuccess(metadata);
      actions = hot('-a', {a: action});
      const expected = cold('-(a)', {
        a: new StopSpinning(),
      });
      return expect(effects.updateMetadataFileSuccess$).toBeObservable(expected);
    });
  });

  describe('updateMetadataFileFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('UpdateMetadata failed');
      const action = new UpdateMetadataFileFail(error);
      actions = hot('-a', {a: action});
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message: error.message as any})
      });
      return expect(effects.updateMetadataFileFail$).toBeObservable(expected);
    });
  });

  describe('uploadFile$', () => {
    it('should return a UploadFileSuccess action and dispatch StartSpinning action', async () => {
      const payload = { file: 'any', path: 'any-path', metadata: {} };
      const downloadUrl = 'any-url';
      const action = new UploadFile(payload);
      actions = hot('-a', {a: action});
      const outcome = new UploadFileSuccess({ path: payload.path, downloadUrl: downloadUrl});
      const expected = cold('--c', {c: outcome});
      apiService.upload = jest.fn(() => cold('-b|', {b: downloadUrl }));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.uploadFile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });

    it('should return an UploadFileFail action and dispatch StartSpinning action', async () => {
      const payload = { file: 'any', path: 'any-path', metadata: {} };
      const action = new UploadFile(payload);
      actions = hot('-a', {a: action});
      const error = new Error('Upload failed');
      const outcome = new UploadFileFail(error);
      const expected = cold('--c', {c: outcome});
      apiService.upload = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(store, 'dispatch');
      await expect(effects.uploadFile$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(new StartSpinning());
    });
  });

  describe('uploadFileSuccess$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const payload = { file: 'any', path: 'any-path', metadata: {} };
      const downloadUrl = 'any-url';
      const action = new UploadFileSuccess({ path: payload.path, downloadUrl: downloadUrl});
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
      });
      return expect(effects.uploadFileSuccess$).toBeObservable(expected);
    });
  });

  describe('uploadFileFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Upload failed');
      const action = new UploadFileFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.uploadFileFail$).toBeObservable(expected);
    });
  });

  describe('uploadImage$', () => {
    it('should return an UploadFile action and invoke  openImageUploadPopup', async () => {
      const payload = { file: { name: 'any-file' }, filePath: 'any-path', metadata: null };
      const action = new UploadImage(payload);
      actions = hot('-a', {a: action});
      uiService.openImageUploadPopup = jest.fn(() => of(payload));
      const outcome = new UploadFile({file: payload.file, path: `${payload.filePath}/${payload.file.name}`, metadata: null});
      const expected = cold('-c', {c: outcome});
      const spy = jest.spyOn(uiService, 'openImageUploadPopup');
      await expect(effects.uploadImage$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(payload);
    });

    it('should return an UploadImageFail action and dispatch StartSpinning action', async () => {
      const payload = { file: { name: 'any-file' }, filePath: 'any-path', metadata: null };
      const action = new UploadImage(payload);
      actions = hot('-a', {a: action});
      uiService.openImageUploadPopup = jest.fn(() => cold('-#|', {}, error));
      const spy = jest.spyOn(uiService, 'openImageUploadPopup');
      const error = new Error('Upload failed');
      const outcome = new UploadImageFail(error);
      const expected = cold('--c', {c: outcome});
      await expect(effects.uploadImage$).toBeObservable(expected);
      return expect(spy).toHaveBeenCalledWith(payload);
    });
  });

  describe('uploadImageSuccess$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const payload = { file: 'any', path: 'any-path', metadata: {} };
      const downloadUrl = 'any-url';
      const action = new UploadImageSuccess({ path: payload.path, downloadUrl: downloadUrl});
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message}),
      });
      return expect(effects.uploadImageSuccess$).toBeObservable(expected);
    });
  });

  describe('uploadImageFail$', () => {

    it('should return an array of actions containing StopSpinning and OpenSnackBar action', async () => {
      const error = new Error('Upload failed');
      const action = new UploadImageFail(error);
      actions = hot('-a', {a: action});
      const message = undefined;
      const expected = cold('-(ab)', {
        a: new StopSpinning(),
        b: new OpenSnackBar({message})
      });
      return expect(effects.uploadImageFail$).toBeObservable(expected);
    });
  });
});
