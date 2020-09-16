import {StorageModule} from './storage.module';

describe('StorageModule', () => {
  let module: StorageModule;

  beforeEach(() => {
    module = new StorageModule();
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});

