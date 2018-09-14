import {Injectable} from '@angular/core';
import {AngularFireStorage} from 'angularfire2/storage';
import {from, Observable} from 'rxjs/index';
import {MessageContent, Messages} from '../../shared/models/message.model';
import {STORAGE_MSGS} from '../storage-messages';

@Injectable()
export class StorageApiService {
  messages: Messages;

  constructor(private storage: AngularFireStorage) {
    this.messages = new Messages(STORAGE_MSGS);
  }

  delete(filePath: string): Observable<any> {
    console.log('STORAGE SERVICE DELETE FILE: ', filePath);
    const ref = this.storage.ref(filePath);
    return ref.delete();
  }

  download(filePath: string): Observable<any> {
    console.log('Download file path: ', filePath);
    const ref = this.storage.ref(filePath);
    return ref.getDownloadURL();
  }

  getMetadata(filePath: string): Observable<any> {
    console.log('Download file path: ', filePath);
    const ref = this.storage.ref(filePath);
    return ref.getMetadata();
  }

  updateMetadata(filePath: string, metadata: any): Observable<any> {
    console.log('Set metadata for: ', filePath);
    const ref = this.storage.ref(filePath);
    return ref.updateMetatdata( { customMetadata: metadata });
  }

  upload(file: any, path: string, metadata?: any): Observable<any> {
    console.log('*** FILE UPLOAD ***');
    console.log('file: ', file);
    console.log('path: ', path);
    const ref = this.storage.ref(path);
    const task = ref.put(file, { customMetadata: metadata } );
    return from(
      task
      .then(() => this.storage.ref(path).getDownloadURL())
      .catch(err => {
        console.error('*** Error during document upload ***');
        console.error(err);
    }));
  }

  getMessage(id: string, params?: string[]): MessageContent {
    if (params && params.length > 0) {
      return this.messages.getMessageWithParams(id, params);
    }
    return this.messages.getMessage(id);
  }
}
