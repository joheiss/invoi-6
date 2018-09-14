import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'jo-confirmation-dialog-popup',
  templateUrl: './confirmation-dialog-popup.component.html',
  styleUrls: ['./confirmation-dialog-popup.component.scss']
})
export class ConfirmationDialogPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<ConfirmationDialogPopupComponent>) { }

  ngOnInit() {
  }

  onYes() {
    this.dialogRef.close(true);
  }

  onNo() {
    this.dialogRef.close(false);
  }
}
