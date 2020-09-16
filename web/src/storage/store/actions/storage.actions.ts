import {Action} from '@ngrx/store';

// DELETE FILE
export const DELETE_FILE = '[Storage] File delete';
export const DELETE_FILE_FAIL = '[Storage] File delete fail';
export const DELETE_FILE_SUCCESS = '[Storage] File delete success';

export class DeleteFile implements Action {
  readonly type = DELETE_FILE;
  constructor(public payload: any) {}
}

export class DeleteFileFail implements Action {
  readonly type = DELETE_FILE_FAIL;
  constructor(public payload: any) {}
}

export class DeleteFileSuccess implements Action {
  readonly type = DELETE_FILE_SUCCESS;
  constructor(public payload: any) {}
}

// DOWNLOAD FILE
export const DOWNLOAD_FILE = '[Storage] File download';
export const DOWNLOAD_FILE_FAIL = '[Storage] File download fail';
export const DOWNLOAD_FILE_SUCCESS = '[Storage] File download success';

export class DownloadFile implements Action {
  readonly type = DOWNLOAD_FILE;
  constructor(public payload: any) {}
}

export class DownloadFileFail implements Action {
  readonly type = DOWNLOAD_FILE_FAIL;
  constructor(public payload: any) {}
}

export class DownloadFileSuccess implements Action {
  readonly type = DOWNLOAD_FILE_SUCCESS;
  constructor(public payload: any) {}
}

// GET FILE METADATA
export const GET_METADATA_FILE = '[Storage] File get metadata';
export const GET_METADATA_FILE_FAIL = '[Storage] File get metadata fail';
export const GET_METADATA_FILE_SUCCESS = '[Storage] File get metadata success';

export class GetMetadataFile implements Action {
  readonly type = GET_METADATA_FILE;
  constructor(public payload: any) {}
}

export class GetMetadataFileFail implements Action {
  readonly type = GET_METADATA_FILE_FAIL;
  constructor(public payload: any) {}
}

export class GetMetadataFileSuccess implements Action {
  readonly type = GET_METADATA_FILE_SUCCESS;
  constructor(public payload: any) {}
}

// UPDATE FILE METADATA
export const UPDATE_METADATA_FILE = '[Storage] File update metadata';
export const UPDATE_METADATA_FILE_FAIL = '[Storage] File update metadata fail';
export const UPDATE_METADATA_FILE_SUCCESS = '[Storage] File update metadata success';

export class UpdateMetadataFile implements Action {
  readonly type = UPDATE_METADATA_FILE;
  constructor(public payload: any) {}
}

export class UpdateMetadataFileFail implements Action {
  readonly type = UPDATE_METADATA_FILE_FAIL;
  constructor(public payload: any) {}
}

export class UpdateMetadataFileSuccess implements Action {
  readonly type = UPDATE_METADATA_FILE_SUCCESS;
  constructor(public payload: any) {}
}

// UPLOAD FILE
export const UPLOAD_FILE = '[Storage] File upload';
export const UPLOAD_FILE_FAIL = '[Storage] File upload fail';
export const UPLOAD_FILE_SUCCESS = '[Storage] File upload success';

export class UploadFile implements Action {
  readonly type = UPLOAD_FILE;
  constructor(public payload: any) {}
}

export class UploadFileFail implements Action {
  readonly type = UPLOAD_FILE_FAIL;
  constructor(public payload: any) {}
}

export class UploadFileSuccess implements Action {
  readonly type = UPLOAD_FILE_SUCCESS;
  constructor(public payload: any) {}
}

// UPLOAD IMAGE
export const UPLOAD_IMAGE = '[Storage] Image upload';
export const UPLOAD_IMAGE_FAIL = '[Storage] Image upload fail';
export const UPLOAD_IMAGE_SUCCESS = '[Storage] Image upload success';

export class UploadImage implements Action {
  readonly type = UPLOAD_IMAGE;
  constructor(public payload: any) {}
}

export class UploadImageFail implements Action {
  readonly type = UPLOAD_IMAGE_FAIL;
  constructor(public payload: any) {}
}

export class UploadImageSuccess implements Action {
  readonly type = UPLOAD_IMAGE_SUCCESS;
  constructor(public payload: any) {}
}

export type StorageAction =
  DeleteFile | DeleteFileFail | DeleteFileSuccess |
  DownloadFile | DownloadFileFail | DownloadFileSuccess |
  GetMetadataFile | GetMetadataFileFail | GetMetadataFileSuccess |
  UpdateMetadataFile | UpdateMetadataFileFail | UpdateMetadataFileSuccess |
  UploadFile | UploadFileFail | UploadFileSuccess |
  UploadImage | UploadImageFail | UploadImageSuccess;


