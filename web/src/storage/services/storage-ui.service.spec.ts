import {TestBed} from '@angular/core/testing';
import {MaterialModule} from '../../shared/material.module';
import {MatDialog} from '@angular/material/dialog';
import {StorageUiService} from './storage-ui.service';
import {cold} from 'jasmine-marbles';

describe('Storage UI Service', () => {

  let service: StorageUiService;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      providers: [
        {
          provide: MatDialog,
          useValue: {
           open: jest.fn(() => ({ afterClosed: jest.fn(() => cold('-b|', { b: 'any-file'})) }))
          }
        },
        StorageUiService
      ]
    });
    dialog = TestBed.inject(MatDialog);
    service = TestBed.inject(StorageUiService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should create the service', () => {
    expect(service).toBeDefined();
  });

  describe('openImageUploadPopup', () => {
    it('should return the file path and file', async () => {
      const expected = cold('-b|', { b: { filePath: 'any-path', file: 'any-file' }});
      expect(service.openImageUploadPopup({ filePath: 'any-path'})).toBeObservable(expected);
    });
  });
});
