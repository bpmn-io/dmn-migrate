# dmn-migration-utility

[![Build Status](https://travis-ci.com/bpmn-io/dmn-migration-utility.svg?branch=master)](https://travis-ci.com/bpmn-io/dmn-migration-utility)

A migration tool that converts DMN 1.1 diagrams to DMN 1.3.

## Usage

Utility can be used either as a package:

```javascript
const migrateDiagram = require('dmn-migration-utility');

migrateDiagram(dmn11XML)
  .then(dmn13XML => {
    /* ... */
  });
```

or as a command line tool:

```bash
dmn-migration-utility -i ./dmn11.dmn -o ./dmn13.dmn

# or

dmn-migration-utility --input ./dmn11.dmn --output ./dmn13.dmn
```

## License

MIT
