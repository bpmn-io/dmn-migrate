const DmnModdle = require('dmn-moddle');

const BiodiPackage = require ('../resources/biodi.json');

const moddle = new DmnModdle({
  biodi: BiodiPackage
});

const DMN11URI = 'xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd"',
      DMN13URI = 'xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/"';

module.exports = async function migrateDiagram(xml) {
  return new Promise((resolve, reject) => {
    xml = xml.replace(DMN11URI, DMN13URI);

    moddle.fromXML(xml, 'dmn:Definitions', (err, definitions) => {
      if (err) {
        reject(err);
      }

      moddle.toXML(definitions, { format: true }, (err, xml) => {
        if (err) {
          reject(err);
        } else {
          resolve(xml);
        }
      })
    });
  });
};