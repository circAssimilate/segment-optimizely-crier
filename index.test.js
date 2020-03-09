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

// TODO(derek@optimizely.com) Finish WORK IN PROGRESS test
describe.skip('__fetchProjectData', () => {
  it('returns expected data', async () => {
    const fetchedData = await __fetchProjectData('a1b2c3c4d5e6');
    console.log('MADE IT');

    expect(fetchedData).toEqual({
      accountId: '123456',
      attributeKeyToIdMap: { attr_key_one: '9876' },
      eventKeyToIdMap: { event_key_one: '5432' },
    });
  });
});

describe('__uuidv4', () => {
  it('returns a 16 digit string', () => {
    expect(__uuidv4()).toMatch(/[0-9a-z-]{36}/);
  });
});

// TODO(derek@optimizely.com) Finish WORK IN PROGRESS test
describe.skip('onTrack', () => {
  it('returns expected data', async () => {
    jest.spyOn(fetchMock, 'fn');
    const fetchedData = await __fetchProjectData('a1b2c3c4d5e6');

    expect(fetchMock.fn).toHaveBeenCalledWith(1);

    expect(fetchedData).toEqual({
      accountId: '123456',
      attributeKeyToIdMap: { attr_key_one: '9876' },
      eventKeyToIdMap: { event_key_one: '5432' },
    });
  });
});
