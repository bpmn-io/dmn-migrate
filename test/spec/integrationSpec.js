import { expect } from 'chai';

import fs from 'fs';

import { validateXML } from 'xsd-schema-validator';

import { migrateDiagram } from '@bpmn-io/dmn-migrate';

const xsd = 'resources/dmn/xsd/DMN13.xsd';


function verify(fileName, iit = it) {

  iit(`should migrate <${fileName}>`, async function() {

    // given
    let xml = read(fileName);

    // when
    xml = await migrateDiagram(xml);

    const result = await validate(xml);

    // then
    expect(result.valid).to.be.true;
  });
}

verify.only = function(fileName) {
  verify(fileName, it.only);
};


describe('integration', function() {

  this.timeout(10000);

  verify('test/fixtures/integration/non-existing-source.dmn');

});



// helpers //////////

async function validate(xml) {
  return validateXML(xml, xsd);
}

function read(path, encoding = 'utf8') {
  return fs.readFileSync(path, encoding);
}
