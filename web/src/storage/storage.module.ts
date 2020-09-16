import {ModuleWithProviders, NgModule} from '@angular/core';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {SharedModule} from '../shared/shared.module';
import {ImageUploadPopupComponent} from './popups/image-upload-popup/image-upload-popup.component';

@NgModule({
  declarations: [
    ImageUploadPopupComponent
  ],
  imports: [
    SharedModule,
    AngularFireStorageModule
  ],
  providers: [
    // FbStorageService
  ],
  entryComponents: [
    ImageUploadPopupComponent
  ]
})
export class StorageModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: StorageModule,
      providers: [
        // StorageApiService,
        // StorageUiService
      ]
    };
  }
}
