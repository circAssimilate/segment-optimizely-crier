# Optimizely Crier

[Segment Custom Destination Functions](https://segment.com/docs/connections/destinations/custom-destinations/#custom%20destinations:%20functions) allow you to build and deploy custom destinations on your workspace. By writing just a few lines of (serverless) code, you can transform your Segment events and send them to other APIs. Functions allow you to send your data into tools outside the Segment catalog, or to your own internal services.

This repo contains the recommended segment function (see [src/index.js](./src/index.js)) for connection with Optimizely. Version 1 of this repo is intended to support Segment event relay for [Optimizely Full Stack](https://www.optimizely.com/platform/full-stack/). Depending on early feedback, future versions may aim to support [Optimizely Web Experimentation](https://www.optimizely.com/platform/experimentation/).

_*NOTE*: The entire Segment Custom Function for Optimizely is in [src/index.js](./src/index.js). The rest of this project simply provides documentation and support for linting / formatting / testing._

## API Documentation

- [Segment Custom Destination Functions](https://segment.com/docs/connections/destinations/custom-destinations/#custom%20destinations:%20functions)
- [Segment track](https://segment.com/docs/connections/spec/track/)
- [Getting your Optimizely Datafile and SDK key](https://docs.developers.optimizely.com/rollouts/docs/datafile#section-access-the-datafile-via-the-app)
  - [Datafile example](https://docs.developers.optimizely.com/rollouts/docs/example-datafile)
- [Optimizely Event API](https://developers.optimizely.com/x/events/api/index.html#api_reference)

## Development

1. `git clone https://github.com/circAssimilate/optimizely-segment-custom-destination-function.git`
2. `cd optimizely-segment-custom-destination-function`
3. `nvm use`
4. `npm install`

## Passing Optimizely user and attribute data via Segment tracking

This Custom Destination Function expects Segment [analytics.track()](https://segment.com/docs/connections/spec/track/) calls to have an event with following format:

```
{
  "event": "CTA Click",
  "integrations": {
    "Optimizely": {
      "attributes": {
        "account_created_epoch_date": 1373291740686,
        "account_id": 123456,
        "is_internal_user": false,
        "role": "developer",
        "total_spend_in_cents": 99000,
      },
      "userId": "9z8y7x6w5v"
    }
  },
  "timestamp": "2020-03-09T22:28:49.259Z",
  "type": "track",
}
```

Most importantly, the data in `integrations.Optimizely` is the engine that makes this solution work - so be sure to set that up where segment tracking occurs. Note, the above example has most [Segment common fields](https://segment.com/docs/connections/spec/common/) removed.

## Setting up in Segment

Create a [Segment Custom Destination Function](https://segment.com/docs/connections/destinations/custom-destinations/#custom%20destinations:%20functions) and copy the contents of [src/index.js](./src/index.js) (until `module.exports`) into Segment. By default, you'll need to complete the following steps to grab a _snapshot_ of the relevant Optimizely data.

1. Copy the relevant Environment SDK Key from the Optimizely Full Stack _Settings_ page (e.g. `a1b2c3d4e5f6`)
2. Complete _Development_ steps above, then run `npm run build -- --sdkKey=a1b2c3d4e5f6` (replacing `a1b2c3d4e5f6` with your SDK Key)
3. Copy all the contents of `dist/index.js`
4. Paste in the Segment Custom Destination Function editor

The `npm run build -- --sdkKey=a1b2c3d4e5f6` script can be ran as needed to update the Optimizely data snapshot. As an example, this could be done each time new Events or Attributes are added.

Optionally, the `shouldFetchOptimizelyData` setting can be used to fetch new Optimizely data each time (not recommended).

## Linting, Formatting, and Spellcheck

This project takes advantage of libraries like [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), and [node-markdown-spellcheck](https://github.com/lukeapage/node-markdown-spellcheck) so contributors don't have to think about those things - these will be run as part of a pre-commit hook.

Run ESLint manually via `npm run lint`.

Prettier can also be configured to [run on save in most IDEs](https://prettier.io/docs/en/editors.html) - or run manually via `npm run pretty`.

Spellcheck for `.md` files can be manually run via `npm run spellcheck`. \*If committing hangs on this step there are errors. When that happens, cancel commit (via `ctrl + c`) and `npm run spellcheck` to manually address errors.

## Testing

This project uses [Jest](https://jestjs.io/) for testing. Tests are lightweight but important to prevent regressions and new bugs. Tests will be run as part of a pre-commit hook, but they can also be run at will via `npm run test`.

## Contributing

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and keeps a [changelog](./CHANGELOG.md) based on https://keepachangelog.com/en/1.0.0/). Every noteworthy PR should either update the _Unreleased_ section in or add a new release section to the changelog. For new releases, be sure and update the version in [package.json](./package.json) as well.
