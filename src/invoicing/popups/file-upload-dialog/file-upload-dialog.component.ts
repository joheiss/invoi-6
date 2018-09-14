import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DocumentLink} from '../../models/document-link';

@Component({
  selector: 'jo-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent {
  file: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<FileUploadDialogComponent>) {
  }

  onFileSelected(event) {
    this.file = event.target.files[0];
    this.data.documentLink.name = this.file.name;
  }

  onUpload() {
    console.log('updated documentLink: ', this.data.documentLink);
    this.dialogRef.close(this.file);
  }
}
