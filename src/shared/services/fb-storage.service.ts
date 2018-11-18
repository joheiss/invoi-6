import {Injectable} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {from, Observable} from 'rxjs/index';

@Injectable()
export class FbStorageService {

  constructor(private afStorage: AngularFireStorage) {
  }

  deleteFile(filePath: string): Observable<any> {
    const ref = this.afStorage.ref(filePath);
    return ref.delete();
  }

  downloadFile(filePath: string): Observable<any> {
    const ref = this.afStorage.ref(filePath);
    return ref.getDownloadURL();
  }

  getMetadata(filePath: string): Observable<any> {
    const ref = this.afStorage.ref(filePath);
    return ref.getMetadata();
  }

  updateMetadata(filePath: string, metadata: any): Observable<any> {
    const ref = this.afStorage.ref(filePath);
    return ref.updateMetatdata( { customMetadata: metadata });
  }

  uploadFile(file: any, path: string, metadata?: any): Observable<any> {
    const ref = this.afStorage.ref(path);
    const task = ref.put(file, { customMetadata: metadata } );
    return from(
      task
        .then(() => this.afStorage.ref(path).getDownloadURL())
        .catch(err => {
          console.error(err);
        }));
  }
}

