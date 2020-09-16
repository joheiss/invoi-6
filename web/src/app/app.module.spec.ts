import {AppModule} from './app.module';

describe('AppModule', () => {
  let module: AppModule;

  beforeEach(() => {
    module = new AppModule();
  });

  it('should create the App module', () => {
    expect(module).toBeTruthy();
  });
});

