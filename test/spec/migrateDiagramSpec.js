const { expect } = require('chai');

const Moddle = require('dmn-moddle');

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

function parse(xml) {
  return new Promise((resolve, reject) => {
    const moddle = Moddle();

    moddle.fromXML(xml, (err, definitions) => {
      if (err) {
        return reject(err);
      }

      resolve(definitions);
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


  it('should create DMNDI for Text Annotation and Association', async function() {

    // given
    let xml = fs.readFileSync('test/spec/text-annotation.dmn', 'utf8');

    // when
    xml = await migrateDiagram(xml);

    const definitions = await parse(xml);

    // then
    expect(definitions.dmnDI.diagrams[0].diagramElements).to.have.lengthOf(3);
  });

});