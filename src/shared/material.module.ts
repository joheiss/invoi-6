import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule, MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule, MatSidenavModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatToolbarModule,

} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDividerModule,
    MatMenuModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDividerModule,
    MatMenuModule
  ],
  declarations: []
})
export class MaterialModule { }
