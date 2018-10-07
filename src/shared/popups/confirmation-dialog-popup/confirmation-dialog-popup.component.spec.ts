import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../../material.module';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConfirmationDialogPopupComponent} from './confirmation-dialog-popup.component';

describe('ConfirmationDialogPopupComponent', () => {
  let component: ConfirmationDialogPopupComponent;
  let fixture: ComponentFixture<ConfirmationDialogPopupComponent>;
  let dialogRef: MatDialogRef<any>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MaterialModule],
      declarations: [ConfirmationDialogPopupComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Any title',
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
    dialogRef = TestBed.get(MatDialogRef);
    fixture = TestBed.createComponent(ConfirmationDialogPopupComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    return expect(component).toBeTruthy();
  });

  describe('onYes', () => {
    it('should invoke the close method of MatDialog with true', async () => {

      const spy = jest.spyOn(dialogRef, 'close');
      component.onYes();
      return expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe('onNo', () => {
    it('should invoke the close method of MatDialog with false', async () => {

      const spy = jest.spyOn(dialogRef, 'close');
      component.onNo();
      return expect(spy).toHaveBeenCalledWith(false);
    });
  });
});

