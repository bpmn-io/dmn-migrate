const { expect } = require('chai');

const { sync: exec } = require('execa');

const binPath = require('../../package.json').bin;

describe('cli', function() {

  this.timeout(10000);

  it('should migrate diagram', async function() {

    // when
    const result = exec(binPath, [
      '-i',
      'test/fixtures/diagram.dmn',
      '-o',
      '/dev/null'
    ]);

    // then
    expect(result.exitCode).to.eql(0);
    expect(result.stdout).to.eql('');
    expect(result.stderr).to.eql('');
  });


  it('should exit with 1 if input or output is missing', function() {

    // given
    let error;

    // when
    try {
      exec(binPath);
    } catch (e) {
      error = e;
    }

    // then
    expect(error).to.exist;
    expect(error.exitCode).to.eql(1);
    expect(error.stdout).to.eql('');
    expect(error.stderr).to.eql('Error: Missing --input or --output');
  });


});