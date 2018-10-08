import {AuthModule} from './auth.module';

describe('AuthModule', () => {
  let module: AuthModule;

  beforeEach(() => {
    module = new AuthModule();
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});

