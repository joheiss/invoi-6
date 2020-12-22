import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../../shared/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ImageUploadPopupComponent} from './image-upload-popup.component';

describe('ImageUploadPopupComponent', () => {
  let component: ImageUploadPopupComponent;
  let fixture: ComponentFixture<ImageUploadPopupComponent>;
  let dialogRef: MatDialogRef<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MaterialModule, FormsModule, ReactiveFormsModule],
      declarations: [ImageUploadPopupComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Any title',
            selectButtonCaption: 'Upload Image',
            filePath: 'anyPath'
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn()
          }
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    dialogRef = TestBed.inject(MatDialogRef);
    fixture = TestBed.createComponent(ImageUploadPopupComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    return expect(component).toBeTruthy();
  });

  describe('onImageUpload', () => {
    it('should invoke the close method of MatDialog', async () => {

      const spy = jest.spyOn(dialogRef, 'close');
      component.onImageUpload();
      return expect(spy).toHaveBeenCalled();
    });
  });
});
