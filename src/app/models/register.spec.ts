import { Register } from './register';

describe('Register', () => {
  it('should create an instance', () => {
    expect(
      new Register(
        '1',
        'Fake',
        'Test',
        'Fake@fake.com',
        'FakePassword',
        123456,
        1
      )
    ).toBeTruthy();
  });
});
