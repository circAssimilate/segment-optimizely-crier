const OPTIMIZELY_CRIER_SEMANTIC_VERSION = '%%PACKAGE_VERSION%%';

/**
 * Optimizely Segment Custom Destination Function:
 *  https://github.com/circAssimilate/segment-optimizely-crier
 *
 * Learn more about destination functions API:
 *  https://segment.com/docs/connections/destinations/destination-functions
 */

/**
 * @description https://segment.com/docs/connections/spec/track/#example
 * @param {SegmentTrackEvent} segmentEvent
 * {
 *   anonymousId: '61db7c12-c437-4efe-9123-f3e2031903b5',
 *   event: 'Change History Page View',
 *   integrations: {
 *     Optimizely: {
 *       attributes: {
 *         account_id: '5935064',
 *         created_epoch_date: 1301345505680,
 *         total_revenue_three_months: 0,
 *         is_internal_user: true,
 *       },
 *       userId: '5935064',
 *     },
 *   },
 *   messageId: 'ajs-0c224f035fce1c9adc62d6c06035439e',
 *   timestamp: '2020-03-09T21:33:11.594Z',
 *   type: 'track',
 *   userId: '5935064_4df8049ed4b011e3aa46635c25628756',
 * }
 * @param {FunctionSettings} settings
 */
async function onTrack({ event, integrations, timestamp }, { apiKey }) {
  const { attributes, userId } =
    (integrations ? integrations : {}).Optimizely || {};

  if (!userId) {
    throw new InvalidEventPayload(
      '[OPTIMIZELY] Optimizely.integrations.userId not present'
    );
  }

  console.log(`[OPTIMIZELY] Optimizely.integrations.userId "${userId}"`); // eslint-disable-line no-console

  let { accountId, attributeKeyToIdMap, eventKeyToIdMap } =
    typeof OPTIMIZELY_DATA !== 'undefined' ? OPTIMIZELY_DATA : {};
  if ([accountId, attributeKeyToIdMap, eventKeyToIdMap].includes(undefined)) {
    console.log('[OPTIMIZELY] Fetching account, attribute, and event data'); // eslint-disable-line no-console
    ({
      accountId,
      attributeKeyToIdMap,
      eventKeyToIdMap,
    } = await __fetchProjectData(apiKey));
  }

  const eventId = eventKeyToIdMap[event];
  if (!eventId) {
    throw new ValidationError(`[OPTIMIZELY] Unrecognized event "${event}"`);
  }

  const eventUuid = __uuidv4();
  const optimizelyTrackEventResponse = await fetch(
    'https://logx.optimizely.com/v1/events',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_id: accountId,
        anonymize_ip: true,
        attributes: Object.entries(attributes)
          .filter(([key]) => {
            const isKnownEvent = !!attributeKeyToIdMap[key];
            // eslint-disable-next-line no-console
            console.log(
              `[OPTIMIZELY] ${
                isKnownEvent ? 'Recognized' : 'Unrecognized'
              } attribute "${key}"`
            );
            return isKnownEvent;
          })
          .map(([key, value]) => ({
            key,
            value,
            type: 'custom',
            entity_id: attributeKeyToIdMap[key],
          })),
        client_name: 'Optimizely/segment-custom-destination-function',
        client_version: OPTIMIZELY_CRIER_SEMANTIC_VERSION,
        enrich_decisions: true,
        visitors: [
          {
            snapshots: [
              {
                decisions: [],
                events: [
                  {
                    entity_id: eventId,
                    key: event,
                    timestamp: Date.parse(timestamp),
                    uuid: eventUuid,
                  },
                ],
              },
            ],
            visitor_id: userId,
          },
        ],
      }),
    }
  );

  // eslint-disable-next-line no-console
  console.log(
    `[OPTIMIZELY] ${optimizelyTrackEventResponse.status} status for event "${event}" (${eventUuid})`
  );

  return optimizelyTrackEventResponse.text().then(responseText => {
    if (responseText) {
      // eslint-disable-next-line no-console
      console.log('[OPTIMIZELY] Event response:', responseText);
    }
  });
}

/**
 * @description Handle identify event - https://segment.com/docs/connections/spec/identify/
 * @param  {SegmentIdentifyEvent} event
 * @param  {FunctionSettings} settings
 */
async function onIdentify(event, settings) {
  throw new EventNotSupported('onIdentify is not supported');
}

/**
 * @description Handle group event - https://segment.com/docs/connections/spec/group/
 * @param  {SegmentGroupEvent} event
 * @param  {FunctionSettings} settings
 */
async function onGroup(event, settings) {
  throw new EventNotSupported('onGroup is not supported');
}

/**
 * @description Handle page event - https://segment.com/docs/connections/spec/page/
 * @param  {SegmentPageEvent} event
 * @param  {FunctionSettings} settings
 */
async function onPage(event, settings) {
  throw new EventNotSupported('onPage is not supported');
}

/**
 * @description Handle screen event - https://segment.com/docs/connections/spec/screen/
 * @param  {SegmentScreenEvent} event
 * @param  {FunctionSettings} settings
 */
async function onScreen(event, settings) {
  throw new EventNotSupported('onScreen is not supported');
}

/**
 * @description Handle alias event - https://segment.com/docs/connections/spec/alias/
 * @param  {SegmentAliasEvent} event
 * @param  {FunctionSettings} settings
 */
async function onAlias(event, settings) {
  throw new EventNotSupported('onAlias is not supported');
}

/**
 * @description Handle delete event - https://segment.com/docs/partners/spec/#delete
 * @param  {SegmentDeleteEvent} event
 * @param  {FunctionSettings} settings
 */
async function onDelete(event, settings) {
  throw new EventNotSupported('onDelete is not supported');
}

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
  onAlias,
  onDelete,
  onGroup,
  onIdentify,
  onPage,
  onScreen,
  onTrack,
};
//endRemoveIf(BUILD)
