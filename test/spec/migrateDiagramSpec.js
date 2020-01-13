const { expect } = require('chai');

const fs = require('fs');

const { validateXML } = require('xsd-schema-validator');

const migrateDiagram = require('../../src/migrateDiagram');

const xsd = 'resources/dmn/xsd/DMN13.xsd';

async function validate(xml) {
  return new Promise((resolve, reject) => {
    validateXML(xml, xsd, (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result);
    });
  });
}

describe('migrateDiagram', function() {

  this.timeout(10000);

  it('should migrate diagram', async function() {

    // given
    let xml = fs.readFileSync('test/spec/diagram.dmn', 'utf8');

    // when
    xml = await migrateDiagram(xml);

    const result = await validate(xml);

    // then
    expect(result.valid).to.be.true;
  });

});