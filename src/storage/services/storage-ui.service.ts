import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ImageUploadPopupComponent} from '../popups/image-upload-popup/image-upload-popup.component';
import {UploadPopupData} from '../models/upload-popup-data';
import {Observable} from 'rxjs/index';
import {filter, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageUiService {
  file: any;

  constructor(private dialog: MatDialog) {}

  openImageUploadPopup(data: UploadPopupData): Observable<any>  {
    return this.dialog.open(ImageUploadPopupComponent, { data: data })
      .afterClosed()
      .pipe(
        filter(file => !!file),
        map(file => {
          return { filePath: data.filePath, file: file };
        })
      );
  }
}
