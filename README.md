# dmn-migrate

[![CI](https://github.com/bpmn-io/dmn-migrate/workflows/CI/badge.svg)](https://github.com/bpmn-io/dmn-migrate/actions?query=workflow%3ACI)

Migrate your DMN diagrams to the latest DMN version (currently __DMN 1.3__).


## Usage

```javascript
const { migrateDiagram } = require('@bpmn-io/dmn-migrate');

const migratedXML = await migrateDiagram(dmn11XML);
```

## See also

* [dmn-migrate-cli](https://github.com/bpmn-io/dmn-migrate-cli) - migrate your DMN diagrams from the command line


## License

MIT
