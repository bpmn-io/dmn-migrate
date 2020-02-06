import DmnModdle from 'dmn-moddle';

import Ids from 'ids';

import {
  isArray,
  isFunction,
  some
} from 'min-dash';

import BiodiPackage from '../resources/dmn/json/biodi.json';

const ids = new Ids([ 32, 36, 1 ]);

const moddle = new DmnModdle({
  biodi: BiodiPackage
});

const DMN11URI = '"http://www.omg.org/spec/DMN/20151101/dmn.xsd"',
      DMN13URI = '"https://www.omg.org/spec/DMN/20191111/MODEL/"';


/**
 * Migrate DMN 1.1 XML to 1.3.
 *
 * @param {string} xml
 *
 * @returns {Promise<string>}
 */
export function migrateDiagram(xml) {

  if (hasNamespace(DMN11URI, xml)) {
    return migrateFrom11To13(xml);
  } else if (hasNamespace(DMN13URI, xml)) {
    return Promise.resolve(xml);
  }

  throw new Error('unknown namespace');
}

/**
 * Check if XML has namespace.
 *
 * @param {string} namespace
 * @param {string} xml
 *
 * @returns {boolean}
 */
function hasNamespace(namespace, xml) {
  return xml.includes(namespace);
}

/**
 * Migrate DMN 1.1 XML to 1.3.
 *
 * @param {string} xml
 *
 * @returns {string}
 */
function migrateFrom11To13(xml) {
  return new Promise((resolve, reject) => {
    xml = xml.replace(DMN11URI, DMN13URI);

    moddle.fromXML(xml, 'dmn:Definitions', (err, definitions) => {
      if (err) {
        return reject(err);
      }

      addIds(definitions);

      addNames(definitions);

      migrateDI(definitions, moddle);

      moddle.toXML(definitions, { format: true }, (err, xml) => {
        if (err) {
          reject(err);
        } else {
          resolve(xml);
        }
      });
    });
  });
}

/**
 * Add ID to element if required.
 *
 * @param {Object} element
 */
function addId(element) {
  if (is(element, 'dmn:DMNElement') && !element.id) {
    element.id = ids.nextPrefixed(element.$type.split(':').pop() + '_', element);
  }
}

/**
 * Add ID to all elements that have to have ID but don't.
 *
 * @param {Object} element
 */
function addIds(element) {
  addId(element);

  Object.values(element).forEach(value => {
    if (value.$type) {
      addId(value);

      addIds(value);
    }

    if (isArray(value)) {
      value.forEach(addIds);
    }
  });
}

/**
 * Add name to element if required.
 *
 * @param {Object} element
 */
function addName(element) {
  if (is(element, 'dmn:NamedElement') && !element.name) {
    element.name = element.id;
  }
}

/**
 * Add names to all elements that have to have names but don't.
 *
 * @param {Object} element
 */
function addNames(element) {
  addName(element);

  Object.values(element).forEach(value => {
    if (value.$type) {
      addName(value);

      addNames(value);
    }

    if (isArray(value)) {
      value.forEach(addNames);
    }
  });
}

/**
 * Create and return `dmndi:DMNDI`.
 *
 * @param {Object} moddle
 *
 * @returns {Object}
 */
function createDMNDI(moddle) {
  const dmnDiagram = moddle.create('dmndi:DMNDiagram', {
    diagramElements: []
  });

  addId(dmnDiagram);

  const dmnDI = moddle.create('dmndi:DMNDI', {
    diagrams: [ dmnDiagram ]
  });

  dmnDiagram.$parent = dmnDI;

  return dmnDI;
}

/**
 * Check if element is type.
 *
 * @param {Object} element
 * @param {string} type
 *
 * @returns {boolean}
 */
function is(element, type) {
  return isFunction(element.$instanceOf) && element.$instanceOf(type);
}

/**
 * Check if element is any type.
 *
 * @param {Object} element
 * @param {Array<string>} types
 *
 * @returns {boolean}
 */
function isAny(element, types) {
  return some(types, type => is(element, type));
}

/**
 * Get referenced DMN element.
 *
 * @param {Object} drgElement
 * @param {string} source
 *
 * @returns {Object}
 */
function getDMNElementRef(drgElement, source) {
  if (is(drgElement, 'dmn:Association')) {
    return drgElement;
  }

  return Object.values(drgElement).reduce((dmnElementRef, dmnElements) => {
    if (isArray(dmnElements)) {
      return dmnElementRef || dmnElements.find(dmnElement => {
        if (is(dmnElement, 'dmn:DMNElement')) {
          return Object.values(dmnElement).find(dmnElementReference => {
            if (is(dmnElementReference, 'dmn:DMNElementReference')) {
              const { href } = dmnElementReference;

              return href.replace('#', '').includes(source);
            }
          });
        }
      });
    }

    return dmnElementRef;
  }, null);
}

/**
 * Migrate custom DI to DMN 1.3 DI.
 *
 * @param {Object} definitions
 * @param {Object} moddle
 *
 * @returns {Object}
 */
function migrateDI(definitions, moddle) {
  const diagramElements = [];

  const semanticElements = [].concat(
    definitions.get('drgElement'),
    definitions.get('artifact')
  );

  semanticElements.forEach(semantic => {
    const extensionElements = semantic.get('extensionElements');

    if (!extensionElements) {
      return;
    }

    extensionElements.get('values').forEach(extensionElement => {
      if (is(extensionElement, 'biodi:Bounds')) {
        const bounds = moddle.create('dc:Bounds', {
          height: extensionElement.get('height'),
          width: extensionElement.get('width'),
          x: extensionElement.get('x'),
          y: extensionElement.get('y')
        });

        const shape = moddle.create('dmndi:DMNShape', {
          bounds,
          dmnElementRef: semantic
        });

        bounds.$parent = shape;

        addId(shape);

        diagramElements.push(shape);

        shape.$parent = diagramElements;
      }

      if (is(extensionElement, 'biodi:Edge')) {
        const waypoints = extensionElement.get('waypoints').map(waypoint => {
          return moddle.create('dc:Point', {
            x: waypoint.get('x'),
            y: waypoint.get('y')
          });
        });

        const dmnElementRef = getDMNElementRef(semantic, extensionElement.get('source'));

        const edge = moddle.create('dmndi:DMNEdge', {
          dmnElementRef,
          waypoint: waypoints
        });

        dmnElementRef.$parent = edge;

        addId(edge);

        waypoints.forEach(wayPoint => wayPoint.$parent = edge);

        diagramElements.push(edge);

        edge.$parent = diagramElements;
      }
    });

    extensionElements.set('values', extensionElements.get('values').filter(extensionElement => {
      return !isAny(extensionElement, [ 'biodi:Bounds', 'biodi:Edge' ]);
    }));

    if (!extensionElements.get('values').length) {
      semantic.set('extensionElements', undefined);
    }
  });

  if (diagramElements.length) {
    const dmnDI = createDMNDI(moddle);

    definitions.set('dmnDI', dmnDI);

    dmnDI.$parent = definitions;

    const diagrams = dmnDI.get('diagrams')[ 0 ];

    diagrams.set('diagramElements', diagramElements);

    diagramElements.forEach(diagramElement => diagramElement.$parent = diagrams);
  }

  return definitions;
}
