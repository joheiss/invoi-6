import {InvoicingRoutingModule} from './invoicing-routing.module';

describe('Invoicing Module', () => {
  let module: InvoicingRoutingModule;

  beforeEach(() => {
    module = new InvoicingRoutingModule();
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});

