import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {By} from '@angular/platform-browser';
import {FileUploadDialogComponent} from './file-upload-dialog.component';
import {SharedModule} from '../../../shared/shared.module';
import {DocumentLink} from '../../models/document-link';

describe('File Upload Dialog Component', () => {
  let component: FileUploadDialogComponent;
  let fixture: ComponentFixture<FileUploadDialogComponent>;
  let dialogRef: MatDialogRef<any>;

  beforeEach(async () => {
    return TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SharedModule],
      declarations: [FileUploadDialogComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}},
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn()
          }
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    dialogRef = TestBed.get(MatDialogRef);
    fixture = TestBed.createComponent(FileUploadDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    return expect(component).toBeTruthy();
  });

  describe('Controller', () => {

    it('should close the dialog window', () => {
      const spy = jest.spyOn(dialogRef, 'close');
      component.onUpload();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('View', () => {

    beforeEach(() => {
      component.data.documentLink = { name: 'anything' } as DocumentLink;
      fixture.detectChanges();
    });

    it('should show upload and cancel buttons', () => {
      let btn: any = fixture.debugElement.query(By.css('#btn_upload')).nativeElement as HTMLButtonElement;
      expect(btn.disabled).toBeFalsy();
      btn = fixture.debugElement.query(By.css('#btn_cancel')).nativeElement as HTMLButtonElement;
      expect(btn.disabled).toBeFalsy();
    });
  });

});
