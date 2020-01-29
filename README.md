# dmn-migrate

[![Build Status](https://travis-ci.com/bpmn-io/dmn-migrate.svg?branch=master)](https://travis-ci.com/bpmn-io/dmn-migrate)

Migrate DMN diagrams from one version of the standard to another (e.g. DMN 1.1 to 1.3).

Currently supported migration paths:

* DMN 1.1 to DMN 1.3

## Usage

### Through command line interface

```bash
dmn-migrate -i ./dmn11.dmn -o ./dmn13.dmn

# or

dmn-migrate --input ./dmn11.dmn --output ./dmn13.dmn
```

### Through JavaScript API

```javascript
const { migrateTo13 } = require('@bpmn-io/dmn-migrate');

migrateTo13(dmn11XML)
  .then(dmn13XML => {
    // ...
  });
```

## License

MIT
