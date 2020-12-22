import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../material.module';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UiService} from './ui.service';
import {cold} from 'jasmine-marbles';

describe('UiService', () => {

  let service: UiService;
  let snackBar: MatSnackBar;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MaterialModule],
      providers: [
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn()
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(() => {
              return {
                afterClosed: jest.fn(() => cold('-a|', {a: 'anything'}))
              };
            })
          }
        },
        UiService
      ]
    });
    service = TestBed.inject(UiService);
    snackBar = TestBed.inject(MatSnackBar);
    dialog = TestBed.inject(MatDialog);

    // Mock implementation of console.log to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  it('should create the service', () => {
    expect(service).toBeDefined();
  });

  describe('openSnackBar', () => {
    it('should invoke the open method on the MatSnackBar', () => {

      const spy = jest.spyOn(snackBar, 'open');
      service.openSnackBar({ text: 'open works', usage: 'info'});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('openUrl', () => {
    it('should invoke the window.open method', () => {

      jest.spyOn(window, 'open').mockImplementation(() => undefined);
      const spy = jest.spyOn(window, 'open');
      const url = 'http://weiss.ich.nicht';
      service.openUrl(url);
      expect(spy).toHaveBeenCalledWith(url, '_blank');
    });
  });

  describe('openConfirmationDialog', () => {
    it('should invoke the open method on the MatDialog', () => {

      const spy = jest.spyOn(dialog, 'open');
      service.openConfirmationDialog({ do: null, title: 'Test' });
      expect(spy).toHaveBeenCalled();
    });
  });
});
