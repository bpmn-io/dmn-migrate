# dmn-migrate

[![CI](https://github.com/bpmn-io/dmn-migrate/workflows/CI/badge.svg)](https://github.com/bpmn-io/dmn-migrate/actions?query=workflow%3ACI)

Migrate your DMN diagrams to __DMN 1.3__, the version supported by [dmn-js](https://github.com/bpmn-io/dmn-js).

Supported source versions are DMN 1.1, 1.2, 1.4, 1.5, 1.6, and 1.7. For DMN 1.4 and newer, only the namespaces are migrated. Model elements unknown to DMN 1.3 remain in the migrated XML, are reported as unparsable when the diagram is imported into [dmn-moddle](https://github.com/bpmn-io/dmn-moddle), and are not exported again.


## Usage

```javascript
const { migrateDiagram } = require('@bpmn-io/dmn-migrate');

const migratedXML = await migrateDiagram(dmn11XML);
```

## See also

* [dmn-migrate-cli](https://github.com/bpmn-io/dmn-migrate-cli) - migrate your DMN diagrams from the command line


## License

MIT
