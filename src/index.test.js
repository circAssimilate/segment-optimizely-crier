const { __fetchProjectData, __uuidv4, onTrack } = require('./');

let fetchMock;

beforeEach(() => {
  fetchMock = {
    fn: () =>
      new Promise(resolve =>
        resolve({
          json: () =>
            new Promise(resolve =>
              resolve({
                accountId: '123456',
                attributes: [{ id: '9876', key: 'attr_key_one' }],
                events: [{ id: '5432', key: 'event_key_one' }],
              })
            ),
        })
      ),
  };
});

// TODO(derek@optimizely.com) Add tests
describe('onTrack', () => {});

// TODO(derek@optimizely.com) Add tests
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
