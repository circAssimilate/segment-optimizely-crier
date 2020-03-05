const { __uuidv4 } = require('./');

describe('__uuidv4', () => {
  it('returns a 16 digit string', () => {
    expect(__uuidv4()).toMatch(/[0-9a-z-]{36}/);
  });
});
