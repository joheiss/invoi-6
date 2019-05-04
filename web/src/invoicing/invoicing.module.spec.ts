import {InvoicingModule} from './invoicing.module';

describe('Invoicing Module', () => {
  let module: InvoicingModule;

  beforeEach(() => {
    module = new InvoicingModule();
  });

  it('should create the module', () => {
    expect(module).toBeTruthy();
  });
});

