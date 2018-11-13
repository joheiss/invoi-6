import {AuthRoutingModule} from './auth-routing.module';

describe('Auth Routing Module', () => {
  let module: AuthRoutingModule;

  beforeEach(() => {
    module = new AuthRoutingModule();
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});

