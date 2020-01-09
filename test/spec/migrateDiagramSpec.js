const { expect } = require('chai');

const fs = require('fs');

const migrateDiagram = require('../../src/migrateDiagram');

describe('migrateDiagram', function() {

  it('should migrate diagram', async function() {

    const xml = fs.readFileSync('test/spec/diagram.dmn', 'utf8');

    const migratedXml = await migrateDiagram(xml);

    console.log(migratedXml);

    expect(migratedXml).to.exist;
  });

});