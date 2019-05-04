import { IfAuthorizedForSalesDirective } from './if-authorized-for-sales.directive';

describe('IfAuthorizedForSalesDirective', () => {
  it('should create an instance', () => {
    const directive = new IfAuthorizedForSalesDirective(null, null);
    expect(directive).toBeTruthy();
  });
});
