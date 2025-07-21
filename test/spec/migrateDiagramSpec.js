import { expect, use as chaiUse } from 'chai';

import chaiAsPromised from 'chai-as-promised';

chaiUse(chaiAsPromised);

import DmnModdle from 'dmn-moddle';

import fs from 'fs';

import { validateXML } from 'xsd-schema-validator';

import { migrateDiagram, TARGET_DMN_VERSION } from '@bpmn-io/dmn-migrate';

const xsd = 'resources/dmn/xsd/DMN13.xsd';


describe('migrateDiagram', function() {

  this.timeout(10000);

  describe('DMN support', function() {

    it('should migrate DMN 1.1 diagram', async function() {

      // given
      let xml = read('test/fixtures/diagram-1-1.dmn');

      // when
      xml = await migrateDiagram(xml);

      const result = await validate(xml);

      // then
      expect(result.valid).to.be.true;
    });


    it('should migrate DMN 1.2 diagram', async function() {

      // given
      let xml = read('test/fixtures/diagram-1-2.dmn');

      // when
      xml = await migrateDiagram(xml);

      const result = await validate(xml);

      // then
      expect(result.valid).to.be.true;
    });


    it('should migrate DMN 1.3 diagram', async function() {

      // given
      const xml = read('test/fixtures/diagram-1-3.dmn');

      // when
      const migratedXml = await migrateDiagram(xml);

      // then
      expect(xml).to.eql(migratedXml);
    });

  });


  it('should create DMNDI element IDs', async function() {

    // given
    let xml = read('test/fixtures/diagram-1-1.dmn');

    // when
    xml = await migrateDiagram(xml);

    const definitions = await parse(xml);

    // then
    const diagram = definitions.dmnDI.diagrams[0];
    const diagramElements = diagram.diagramElements;

    expect(diagram).to.have.property('id');

    for (const diagramElement of diagramElements) {
      expect(diagramElement).to.have.property('id');

      expect(diagramElement.id).to.match(/DMN(Shape|Edge)_[^_]+/);
    }
  });


  it('should create DMNDI for text annotation and association', async function() {

    // given
    let xml = read('test/fixtures/text-annotation.dmn');

    // when
    xml = await migrateDiagram(xml);

    const definitions = await parse(xml);

    // then
    expect(definitions.dmnDI.diagrams[0].diagramElements).to.have.lengthOf(3);
  });


  it('should migrate diagram with prefixed dmn namespace', async function() {

    // given
    let xml = read('test/fixtures/prefixed-namespace.dmn');

    // when
    xml = await migrateDiagram(xml);

    const result = await validate(xml);

    // then
    expect(result.valid).to.be.true;
  });


  it('should NOT create DMNDI if no DI', async function() {

    // given
    let xml = read('test/fixtures/prefixed-namespace.dmn');

    // when
    xml = await migrateDiagram(xml);

    const definitions = await parse(xml);

    // then
    expect(definitions.dmnDI).to.not.exist;
  });


  it('should NOT create DMNDI on empty definitions', async function() {

    // given
    let xml = read('test/fixtures/empty-definitions.dmn');

    // when
    xml = await migrateDiagram(xml);

    const definitions = await parse(xml);

    // then
    expect(definitions.dmnDI).not.to.exist;
  });


  describe('errors', function() {

    it('should return binary without migrating', async function() {

      // given
      const xml = read('test/fixtures/binary.png', 'base64');

      const migrate = () => {
        return migrateDiagram(xml);
      };

      // when
      // then
      expect(migrate()).to.eventually.equal(xml);
    });


    it('should return BPMN diagram without migrating', async function() {

      // given
      const xml = read('test/fixtures/diagram.bpmn');

      const migrate = () => {
        return migrateDiagram(xml);
      };

      // when
      // then
      expect(migrate()).to.eventually.equal(xml);
    });


    it('should return txt without migrating', async function() {

      // given
      const xml = read('test/fixtures/text.txt');

      const migrate = () => {
        return migrateDiagram(xml);
      };

      // when
      // then
      expect(migrate()).to.eventually.equal(xml);
    });


    it('should return broken XML without migrating', async function() {

      // given
      const xml = '<?xml version="1.0" encoding="UTF-8"?><definitions xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd"';

      const migrate = () => {
        return migrateDiagram(xml);
      };

      // when
      // then
      expect(migrate()).to.eventually.equal(xml);
    });


    // TODO(nikku): someone come up with a smart error
    // that we can use to test blow-up behavior (without
    // jeopardizing our forgiveness)
    it('should throw migration error');

  });


  it('should export { TARGET_DMN_VERSION }', function() {
    expect(TARGET_DMN_VERSION).to.eql('1.3');
  });

});



// helpers //////////

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

async function parse(xml) {
  const moddle = new DmnModdle();

  const {
    rootElement: definitions
  } = await moddle.fromXML(xml);

  return definitions;
}

function read(path, encoding = 'utf8') {
  return fs.readFileSync(path, encoding);
}
