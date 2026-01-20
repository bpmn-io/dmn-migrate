const { expect } = require('chai');


describe('dmn-migrate', function() {

  it('should expose CJS bundle', async function() {
    const { migrateDiagram } = require('@bpmn-io/dmn-migrate');

    expect(migrateDiagram).to.exist;
  });


  it('should expose ESM bundle', async function() {
    const { migrateDiagram } = await import('@bpmn-io/dmn-migrate');

    expect(migrateDiagram).to.exist;
  });

});
