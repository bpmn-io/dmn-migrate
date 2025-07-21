describe('dmn-migrate', function() {

  it('should expose CJS bundle', async function() {

    const { expect } = await import('chai');

    const dmnMigrate = require('@bpmn-io/dmn-migrate');

    expect(dmnMigrate.migrateDiagram).to.exist;
  });
});
