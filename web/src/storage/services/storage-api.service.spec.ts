import {TestBed} from '@angular/core/testing';
import {mockFbStorageService} from '../../test/factories/mock-fb-services';
import {FbStorageService} from '../../shared/services/fb-storage.service';
import {StorageApiService} from './storage-api.service';

describe('Storage Api Service', () => {
  let fbStorage: FbStorageService;
  let service: StorageApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: FbStorageService, useValue: mockFbStorageService },
        StorageApiService
      ]
    });
    fbStorage = TestBed.get(FbStorageService);
    service = TestBed.get(StorageApiService);

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('should create the service', () => {
    expect(service).toBeDefined();
  });

  describe('delete', async () => {
    it('should invoke the deleteFile method of the FireStorage interface', async () => {

      const spy = jest.spyOn(fbStorage, 'deleteFile');
      service.delete('any-path');
      return expect(spy).toHaveBeenCalled();
    });
  });

  describe('download', async () => {
    it('should invoke the downloadFile method of the FireStorage interface', async () => {

      const spy = jest.spyOn(fbStorage, 'downloadFile');
      service.download('any-path');
      return expect(spy).toHaveBeenCalled();
    });
  });

  describe('getMetadata', async () => {
    it('should invoke the getMetadata method of the FireStorage interface', async () => {

      const spy = jest.spyOn(fbStorage, 'getMetadata');
      service.getMetadata('any-path');
      return expect(spy).toHaveBeenCalled();
    });
  });

  describe('updateMetadata', async () => {
    it('should invoke the updateMetadata method of the FireStorage interface', async () => {

      const spy = jest.spyOn(fbStorage, 'getMetadata');
      service.updateMetadata('any-path', { contentLanguage: 'de' });
      return expect(spy).toHaveBeenCalled();
    });
  });

  describe('upload', async () => {
    it('should invoke the uploadFile method of the FireStorage interface', async () => {

      const spy = jest.spyOn(fbStorage, 'uploadFile');
      service.upload('any-file', 'any-path', { contentLanguage: 'de' });
      return expect(spy).toHaveBeenCalled();
    });
  });

});
