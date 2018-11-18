import {ModuleWithProviders, NgModule} from '@angular/core';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {SharedModule} from '../shared/shared.module';
import {StorageApiService} from './services/storage-api.service';
import {ImageUploadPopupComponent} from './popups/image-upload-popup/image-upload-popup.component';
import {StorageUiService} from './services';
import {FbStorageService} from '../shared/services/fb-storage.service';

@NgModule({
  declarations: [
    ImageUploadPopupComponent
  ],
  imports: [
    SharedModule,
    AngularFireStorageModule
  ],
  providers: [
    FbStorageService
  ],
  entryComponents: [
    ImageUploadPopupComponent
  ]
})
export class StorageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: StorageModule,
      providers: [
        StorageApiService,
        StorageUiService
      ]
    };
  }
}
