import { Landlord } from './landlord';

describe('Landlord', () => {
  it('should create an instance', () => {
    expect(new Landlord(0, '', '', '', '', 0, 0)).toBeTruthy();
  });
});
