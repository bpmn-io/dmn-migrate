# dmn-migrate

[![Build Status](https://travis-ci.com/bpmn-io/dmn-migrate.svg?branch=master)](https://travis-ci.com/bpmn-io/dmn-migrate)

Migrate your DMN diagrams to the latest DMN version. Current target version: __DMN 1.3__.


## Usage

### Through command line interface

```bash
dmn-migrate -i ./dmn11.dmn -o ./dmn13.dmn

# or

dmn-migrate --input ./dmn11.dmn --output ./dmn13.dmn
```

### Through JavaScript API

```javascript
const { migrateDMN } = require('@bpmn-io/dmn-migrate');

const migratedXML = await migrateDMN(dmn11XML);
```

## License

MIT
