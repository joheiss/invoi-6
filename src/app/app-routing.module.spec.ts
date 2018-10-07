import {AppRoutingModule} from './app-routing.module';

describe('App Routing Module', () => {
  let module: AppRoutingModule;

  beforeEach(() => {
    module = new AppRoutingModule();
  });

  it('should create the App Routing module', () => {
    expect(module).toBeTruthy();
  });
});

