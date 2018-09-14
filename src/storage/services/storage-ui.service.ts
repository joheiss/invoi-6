import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ImageUploadPopupComponent} from '../popups/image-upload-popup/image-upload-popup.component';
import {UploadPopupData} from '../models/upload-popup-data';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class StorageUiService {
  file: any;

  constructor(private dialog: MatDialog) {}

  openImageUploadPopup(data: UploadPopupData): Observable<any>  {
    return this.dialog.open(ImageUploadPopupComponent, { data: data })
      .afterClosed()
      .filter(file => !!file)
      .map(file => {
        return { filePath: data.filePath, file: file };
      });
  }
}
