# Optimizely Crier

[Segment Custom Destination Functions](https://segment.com/docs/connections/destinations/custom-destinations/#custom%20destinations:%20functions) allow you to build and deploy custom destinations on your workspace. By writing just a few lines of (serverless) code, you can transform your Segment events and send them to other APIs. Functions allow you to send your data into tools outside the Segment catalog, or to your own internal services.

This repo contains the recommended segment function (see [index.js](./index.js)) for connection with Optimizely. Version 1 of this repo is intended to support Segment event relay for [Optimizely Full Stack](https://www.optimizely.com/platform/full-stack/). Depending on early feedback, future versions may aim to support [Optimizely Web Experimentation](https://www.optimizely.com/platform/experimentation/).

_*NOTE*: The entire Segment Custom Function for Optimizely is in [index.js](./index.js). The rest of this project simply provides documentation and support for linting / formatting / testing._

## API Documentation

- [Segment Custom Destination Functions](https://segment.com/docs/connections/destinations/custom-destinations/#custom%20destinations:%20functions)
- [Segment track](https://segment.com/docs/connections/spec/track/)
- [Getting your Optimizely Datafile and SDK key](https://docs.developers.optimizely.com/rollouts/docs/datafile#section-access-the-datafile-via-the-app)
  - [Datafile example](https://docs.developers.optimizely.com/rollouts/docs/example-datafile)
- [Optimizely Event API](https://developers.optimizely.com/x/events/api/index.html#api_reference)

## Using in Segment

Create a [Segment Custom Destination Function](https://segment.com/docs/connections/destinations/custom-destinations/#custom%20destinations:%20functions) and copy the contents of [index.js](./index.js) (until `module.exports`) into Segment. As an optional step to improve Custom Destination Function performance, take a snapshot of the datafile (this should be done each time new Events or Attributes are added).

1.  Open Chrome JavaScript Console and paste contents of [index.js](./index.js) (until `module.exports`)
2.  Run this in the Chrome JavaScript Console with the desired sdkKey: `{ OPTIMIZELY_DATA: await __fetchProjectData('a1b2c3d4e5f6') }`
3.  Right click on `OPTIMIZELY_DATA` key, click _Store as global variable_
4.  Wrap temp variable output in Chrome copy() method (e.g. `copy(temp1)`, `copy(temp2)`)
5.  Paste as value for `OPTIMIZELY_DATA` constant

## Development

1. `git clone https://github.com/circAssimilate/optimizely-segment-custom-destination-function.git`
2. `cd optimizely-segment-custom-destination-function`
3. `npm install`

## Linting, Formatting, and Spellcheck

This project takes advantage of libraries like [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), and [node-markdown-spellcheck](https://github.com/lukeapage/node-markdown-spellcheck) so contributors don't have to think about those things - these will be run as part of a pre-commit hook.

Run ESLint manually via `npm run lint`.

Prettier can also be configured to [run on save in most IDEs](https://prettier.io/docs/en/editors.html) - or run manually via `npm run pretty`.

Spellcheck for `.md` files can be manually run via `npm run spellcheck`. \*If committing hangs on this step there are errors. When that happens, cancel commit (via `ctrl + c`) and `npm run spellcheck` to manually address errors.

## Testing

This project uses [Jest](https://jestjs.io/) for testing. Tests are lightweight but important to prevent regressions and new bugs. Tests will be run as part of a pre-commit hook, but they can also be run at will via `npm run test`.
