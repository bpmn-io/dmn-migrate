const { expect } = require('chai');

const { sync: exec } = require('execa');

const { sync: del } = require('del');

const path = require('path');

const fs = require('fs');

const binPath = require('../../package.json').bin;

describe('cli', function() {

  this.timeout(10000);

  it('should migrate diagram', function() {

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


  describe('DMN 1.3 diagram', function() {

    const INPUT_PATH = path.join(__dirname, '../fixtures/diagram-1-3.dmn');
    const OUTPUT_PATH = path.join(__dirname, 'tmp.dmn');

    afterEach(function() {
      del(OUTPUT_PATH);
    });


    it('should leave DMN 1.3 diagram as it is', function() {

      // given
      const inputDiagram = fs.readFileSync(INPUT_PATH, 'utf8');

      // when
      const result = exec(binPath, [
        '-i',
        INPUT_PATH,
        '-o',
        OUTPUT_PATH
      ]);

      // then
      expect(result.exitCode).to.eql(0);
      expect(result.stdout).to.eql('');
      expect(result.stderr).to.eql('');

      const outputDiagram = fs.readFileSync(OUTPUT_PATH, 'utf8');
      expect(outputDiagram).to.eql(inputDiagram);
    });
  });
});