const OPTIMIZELY_CRIER_SEMANTIC_VERSION = '%%PACKAGE_VERSION%%';

/**
 * @description Used to fetch account, attribute, and event data in onTrack or for OPTIMIZELY_DATA
 * @param {String} sdkKey
 */
async function __fetchProjectData(sdkKey, { fetchPolyfill }) {
  const fetch = fetchPolyfill || window.fetch;
  const url = `https://cdn.optimizely.com/datafiles/${sdkKey}.json`;
  const optimizelyDatafileResponse = await fetch(url);
  const {
    accountId,
    attributes,
    events,
  } = await optimizelyDatafileResponse.json();
  const idToKeyMapReduceFn = (acc, { id, key }) => ({ ...acc, [key]: id });
  return {
    accountId,
    attributeKeyToIdMap: attributes.reduce(idToKeyMapReduceFn, {}),
    eventKeyToIdMap: events.reduce(idToKeyMapReduceFn, {}),
  };
}

/**
 * @description UUID generator from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
function __uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//removeIf(BUILD)
module.exports = {
  __fetchProjectData,
  __uuidv4,
};
//endRemoveIf(BUILD)
