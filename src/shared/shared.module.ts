import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from '../auth/interceptors/auth.interceptor';
import {ConfirmationDialogPopupComponent} from './popups/confirmation-dialog-popup/confirmation-dialog-popup.component';
import {IfAuthorizedAsDirective} from './directives/if-authorized-as.directive';

@NgModule({
  declarations: [
    ConfirmationDialogPopupComponent,
    IfAuthorizedAsDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    IfAuthorizedAsDirective
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DecimalPipe,
    // I18nUtilityService,
    // UiService,
    //  LogService
  ],
  entryComponents: [
    ConfirmationDialogPopupComponent
  ]
})

export class SharedModule {
  /*
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        DecimalPipe,
        I18nUtilityService,
        UiService
      ]
    };
  }
  */
}
