import {ModuleWithProviders, NgModule} from '@angular/core';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {SharedModule} from '../shared/shared.module';
import {StorageApiService} from './services/storage-api.service';
import {ImageUploadPopupComponent} from './popups/image-upload-popup/image-upload-popup.component';
import {StorageUiService} from './services';

@NgModule({
  declarations: [
    ImageUploadPopupComponent
  ],
  imports: [
    SharedModule,
    AngularFireStorageModule
  ],
  providers: [
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
