const {
  expect
} = require('chai');


describe('dmn-migrate', function() {

  it('should expose CJS bundle', function() {
    const dmnMigrate = require('../../dist');

    expect(dmnMigrate.migrateDiagram).to.exist;
  });
});
