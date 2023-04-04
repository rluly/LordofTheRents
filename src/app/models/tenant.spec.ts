import { Tenant } from './tenant';

describe('Tenant', () => {
  it('should create an instance', () => {
    expect(new Tenant(0, 0, '', '', '')).toBeTruthy();
  });
});
