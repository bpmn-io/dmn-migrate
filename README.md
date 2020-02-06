# dmn-migrate

[![Build Status](https://travis-ci.com/bpmn-io/dmn-migrate.svg?branch=master)](https://travis-ci.com/bpmn-io/dmn-migrate)

Migrate your DMN diagrams to the latest DMN version (currently __DMN 1.3__).


## Usage

```javascript
const { migrateDiagram } = require('@bpmn-io/dmn-migrate');

const migratedXML = await migrateDiagram(dmn11XML);
```

## License

MIT
