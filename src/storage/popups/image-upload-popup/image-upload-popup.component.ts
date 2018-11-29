import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'jo-user-image-upload-popup',
  templateUrl: './image-upload-popup.component.html',
  styleUrls: ['./image-upload-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadPopupComponent {
  file: any;
  fileName: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<ImageUploadPopupComponent>) {
  }

  getTitle(): string {
    if (this.data.title) {
      return this.data.title;
    }
    return `Bild hochladen`;
  }

  getSelectButtonCaption(): string {
    if (this.data.selectButtonCaption) {
      return this.data.selectButtonCaption;
    }
    return 'Bild auswählen';
  }

  onImageSelected(event) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }

  onImageUpload() {
    this.dialogRef.close(this.file);
  }
}
