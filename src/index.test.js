const { __fetchProjectData, __uuidv4 } = require('./');

// TODO(derek@optimizely.com) Update tests
describe('__fetchProjectData', () => {
  it('fails as expected with no SDK Key', () => {});
  it('fails as expected with invalid SDK Key', () => {});
  it('returns expected output when valid sdkKey is provided', () => {});
  it('returns expected output when valid sdkKey and fetchPolyfill option', () => {});
});

describe('__uuidv4', () => {
  it('returns a 16 digit string', () => {
    expect(__uuidv4()).toMatch(/[0-9a-z-]{36}/);
  });
});
