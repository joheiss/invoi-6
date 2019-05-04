import {AppServerModule} from './app.server.module';

describe('App Server Module', () => {
  let module: AppServerModule;

  beforeEach(() => {
    module = new AppServerModule();
  });

  it('should create the App Server module', () => {
    expect(module).toBeTruthy();
  });
});

