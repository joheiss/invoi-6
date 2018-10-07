import {MaterialModule} from './material.module';

describe('MaterialModule', () => {
  let module: MaterialModule;

  beforeEach(() => {
    module = new MaterialModule();
  });

  it('should create the Material module', () => {
    expect(module).toBeTruthy();
  });
});

