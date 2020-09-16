import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {STORAGE_MSGS} from '../storage-messages';
import {FbStorageService} from '../../shared/services/fb-storage.service';
import {StorageModule} from '../storage.module';
import {MessageContent, Messages} from 'jovisco-domain';

@Injectable({
  providedIn: StorageModule
})
export class StorageApiService {

  messages: Messages;

  constructor(private afStorage: FbStorageService) {
    this.messages = new Messages(STORAGE_MSGS);
  }

  delete(filePath: string): Observable<any> {
    return this.afStorage.deleteFile(filePath);
  }

  download(filePath: string): Observable<any> {
    return this.afStorage.downloadFile(filePath);
  }

  getMetadata(filePath: string): Observable<any> {
    return this.afStorage.getMetadata(filePath);
  }

  updateMetadata(filePath: string, metadata: any): Observable<any> {
    return this.afStorage.updateMetadata(filePath, metadata);
  }

  upload(file: any, path: string, metadata?: any): Observable<any> {
    return this.afStorage.uploadFile(file, path, metadata);
  }

  getMessage(id: string, params?: string[]): MessageContent {
    if (params && params.length > 0) {
      return this.messages.getMessageWithParams(id, params);
    }
    return this.messages.getMessage(id);
  }
}
