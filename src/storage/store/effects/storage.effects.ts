import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as storageActions from '../actions';
import {of} from 'rxjs/index';
import * as fromRoot from '../../../app/store';
import {Store} from '@ngrx/store';
import {StorageApiService, StorageUiService} from '../../services';

@Injectable()
export class StorageEffects {

  constructor(private actions$: Actions,
              private store: Store<fromRoot.AppState>,
              private storageUiService: StorageUiService,
              private storageService: StorageApiService) {
  }

  // DELETE FILE
  @Effect()
  deleteFile$ = this.actions$.pipe(
    ofType(storageActions.DELETE_FILE),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: storageActions.DeleteFile) => action.payload),
    switchMap(path => this.storageService.delete(path)
      .pipe(
        map(res => new storageActions.DeleteFileSuccess(path)),
        catchError(error => of(new storageActions.DeleteFileFail(error)))
      ))
  );

  @Effect()
  deleteFileSuccess$ = this.actions$.pipe(
    ofType(storageActions.DELETE_FILE_SUCCESS),
    map((action: storageActions.DeleteFileSuccess) => action.payload),
    tap(path => console.log('DELETE SUCCESS RESPONSE: ', path)),
    switchMap(path => [
      // new documentLinkActions.DeleteDocumentLink(path),
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({message: this.storageService.getMessage('file-delete-success', [path])})
    ])
  );

  @Effect()
  deleteFileFail$ = this.actions$.pipe(
    ofType(storageActions.DELETE_FILE_FAIL),
    map((action: storageActions.DeleteFileFail) => action.payload),
    tap(err => console.log('DELETE FAIL RESPONSE: ', err)),
    switchMap(err => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({message: this.storageService.getMessage(err.code)})
    ])
  );

  // DOWNLOAD FILE
  @Effect()
  downloadFile$ = this.actions$.pipe(
    ofType(storageActions.DOWNLOAD_FILE),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: storageActions.DownloadFile) => action.payload),
    switchMap(path => this.storageService.download(path)
      .pipe(
        tap(downloadUrl => console.log('AFTER FILE DOWNLOAD: ', downloadUrl)),
        map(downloadUrl => new storageActions.DownloadFileSuccess({path: path, downloadUrl: downloadUrl})),
        catchError(error => of(new storageActions.DownloadFileFail(error)))
      ))
  );

  @Effect()
  downloadFileSuccess$ = this.actions$.pipe(
    ofType(storageActions.DOWNLOAD_FILE_SUCCESS),
    tap(() => console.log('AT DOWNLOAD FILE SUCCESS')),
    map((action: storageActions.DownloadFileSuccess) => action.payload),
    tap(payload => console.log('***opening new window for: ', payload.downloadUrl)),
    switchMap(payload => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenUrl(payload.downloadUrl),
      new fromRoot.OpenSnackBar({message: this.storageService.getMessage('file-download-success', [payload.path])})
    ])
  );

  @Effect()
  downloadFileFail$ = this.actions$.pipe(
    ofType(storageActions.DOWNLOAD_FILE_FAIL),
    tap(() => console.log('AT DOWNLOAD FILE FAIL')),
    map((action: storageActions.DownloadFileFail) => action.payload),
    tap(payload => console.log('FILE DOWNLOAD FAIL: ', payload)),
    switchMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({message: this.storageService.getMessage('file-download-fail')})
    ])
  );

  // GET METADATA FILE
  @Effect()
  getMetadataFile$ = this.actions$.pipe(
    ofType(storageActions.GET_METADATA_FILE),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: storageActions.GetMetadataFile) => action.payload),
    switchMap(path => this.storageService.getMetadata(path)
      .pipe(
        tap(metadata => console.log('AFTER GET FILE METADATA: ', metadata)),
        map(metadata => new storageActions.GetMetadataFileSuccess(metadata)),
        catchError(error => of(new storageActions.GetMetadataFileFail(error)))
      ))
  );

  @Effect()
  getMetadataFileSuccess$ = this.actions$.pipe(
    ofType(storageActions.GET_METADATA_FILE_SUCCESS),
    tap(() => console.log('AT GET METADATA FILE SUCCESS')),
    map((action: storageActions.GetMetadataFileSuccess) => action.payload),
    switchMap(metadata => [
      new fromRoot.StopSpinning()
    ])
  );

  @Effect()
  getMetadataFileFail$ = this.actions$.pipe(
    ofType(storageActions.GET_METADATA_FILE_FAIL),
    tap(() => console.log('AT GET METADATA FILE FAIL')),
    map((action: storageActions.GetMetadataFileFail) => action.payload),
    switchMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: error.message
      })
    ])
  );

  // UPDATE METADATA FILE
  @Effect()
  updateMetadataFile$ = this.actions$.pipe(
    ofType(storageActions.UPDATE_METADATA_FILE),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: storageActions.UpdateMetadataFile) => action.payload),
    switchMap(payload => this.storageService.updateMetadata(payload.path, payload.metadata)
      .pipe(
        tap(res => console.log('AFTER UPDATE FILE METADATA: ', res)),
        map(res => new storageActions.UpdateMetadataFileSuccess(res)),
        catchError(error => of(new storageActions.UpdateMetadataFileFail(error)))
      ))
  );

  @Effect()
  updateMetadataFileSuccess$ = this.actions$.pipe(
    ofType(storageActions.UPDATE_METADATA_FILE_SUCCESS),
    tap(() => console.log('AT UPDATE METADATA FILE SUCCESS')),
    map((action: storageActions.UpdateMetadataFileSuccess) => action.payload),
    switchMap(res => [
      new fromRoot.StopSpinning()
    ])
  );

  @Effect()
  updateMetadataFileFail$ = this.actions$.pipe(
    ofType(storageActions.UPDATE_METADATA_FILE_FAIL),
    tap(() => console.log('AT UPDATE METADATA FILE FAIL')),
    map((action: storageActions.GetMetadataFileFail) => action.payload),
    switchMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({message: error.message})
    ])
  );

  // UPLOAD FILE
  @Effect()
  uploadFile$ = this.actions$.pipe(
    ofType(storageActions.UPLOAD_FILE),
    tap(() => this.store.dispatch(new fromRoot.StartSpinning())),
    map((action: storageActions.UploadFile) => action.payload),
    switchMap(payload => this.storageService.upload(payload.file, payload.path, payload.metadata)
      .pipe(
        map(downloadUrl => new storageActions.UploadFileSuccess({path: payload.path, downloadUrl: downloadUrl})),
        catchError(error => of(new storageActions.UploadFileFail(error)))
      ))
  );

  @Effect()
  uploadFileSuccess$ = this.actions$.pipe(
    ofType(storageActions.UPLOAD_FILE_SUCCESS),
    map((action: storageActions.UploadFileSuccess) => action.payload),
    tap(payload => console.log('UPLOAD FILE SUCCESS: ', payload)),
    switchMap(payload => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.storageService.getMessage('file-upload-success', [payload.path])
      })
    ])
  );

  @Effect()
  uploadFileFail$ = this.actions$.pipe(
    ofType(storageActions.UPLOAD_FILE_FAIL),
    map((action: storageActions.UploadFileFail) => action.payload),
    tap(payload => console.log('UPLOAD FILE FAIL: ', payload)),
    switchMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.storageService.getMessage('file-upload-fail', [error.message])
      })
    ])
  );

  @Effect()
  uploadImage$ = this.actions$.pipe(
    ofType(storageActions.UPLOAD_IMAGE),
    map((action: storageActions.UploadImage) => action.payload),
    switchMap(payload => this.storageUiService.openImageUploadPopup(payload)
      .pipe(
        map(response => {
          return {file: response.file, path: `${response.filePath}/${response.file.name}`, metadata: null};
        }),
        map(payload => new storageActions.UploadFile(payload)),
        catchError(error => of(new storageActions.UploadImageFail(error)))
      ))
  );

  @Effect()
  uploadImageSuccess$ = this.actions$.pipe(
    ofType(storageActions.UPLOAD_IMAGE_SUCCESS),
    map((action: storageActions.UploadImageSuccess) => action.payload),
    tap(payload => console.log('UPLOAD IMAGE SUCCESS: ', payload)),
    switchMap(payload => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.storageService.getMessage('image-upload-success', [payload.path])
      })
    ])
  );

  @Effect()
  uploadImageFail$ = this.actions$.pipe(
    ofType(storageActions.UPLOAD_IMAGE_FAIL),
    map((action: storageActions.UploadImageFail) => action.payload),
    tap(payload => console.log('UPLOAD IMAGE FAIL: ', payload)),
    switchMap(error => [
      new fromRoot.StopSpinning(),
      new fromRoot.OpenSnackBar({
        message: this.storageService.getMessage('image-upload-fail', [error.message])
      })
    ])
  );
}
