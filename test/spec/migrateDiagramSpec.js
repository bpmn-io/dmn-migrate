const { expect } = require('chai');

const Moddle = require('dmn-moddle');

const fs = require('fs');

const { validateXML } = require('xsd-schema-validator');

const { migrateDiagram } = require('../../src/migrateDiagram');

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

  it('should migrate DMN 1.1 diagram', async function() {

    // given
    let xml = fs.readFileSync('test/fixtures/diagram-1-1.dmn', 'utf8');

    // when
    xml = await migrateDiagram(xml);

    const result = await validate(xml);

    // then
    expect(result.valid).to.be.true;
  });


  it('should migrate DMN 1.2 diagram', async function() {

    // given
    let xml = fs.readFileSync('test/fixtures/diagram-1-2.dmn', 'utf8');

    // when
    xml = await migrateDiagram(xml);

    const result = await validate(xml);

    // then
    expect(result.valid).to.be.true;
  });


  it('should migrate DMN 1.3 diagram', async function() {

    // given
    const xml = fs.readFileSync('test/fixtures/diagram-1-3.dmn', 'utf8');

    // when
    const migratedXml = await migrateDiagram(xml);

    // then
    expect(xml).to.eql(migratedXml);
  });


  it('should fail when diagram cannot be parsed', async function() {

    // given
    const xml = '<?xml version="1.0" encoding="UTF-8"?>';
    let error;

    // when
    try {
      await migrateDiagram(xml);
    } catch (e) {
      error = e;
    }

    // then
    expect(error).to.exist;
    expect(error.message).to.eql('unknown namespace');
  });


  it('should create DMNDI for Text Annotation and Association', async function() {

    // given
    let xml = fs.readFileSync('test/fixtures/text-annotation.dmn', 'utf8');

    // when
    xml = await migrateDiagram(xml);

    const definitions = await parse(xml);

    // then
    expect(definitions.dmnDI.diagrams[0].diagramElements).to.have.lengthOf(3);
  });


  it('should migrate diagram with prefixed dmn namespace', async function() {

    // given
    let xml = fs.readFileSync('test/fixtures/prefixed-namespace.dmn', 'utf8');

    // when
    xml = await migrateDiagram(xml);

    const result = await validate(xml);

    // then
    expect(result.valid).to.be.true;
  });


  it('should not create DMNDI in case if no DI information is included', async function() {

    // given
    let xml = fs.readFileSync('test/fixtures/prefixed-namespace.dmn', 'utf8');

    // when
    xml = await migrateDiagram(xml);

    const definitions = await parse(xml);

    // then
    expect(definitions.dmnDI).to.not.exist;
  });
});
