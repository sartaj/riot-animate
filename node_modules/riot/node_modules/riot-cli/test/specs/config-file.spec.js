require('shelljs/global')

const
  EXPECTED_FOLDER = 'test/expected',
  GENERATED_FOLDER = 'test/generated',
  trim = function(string) {
    return string.replace(/^\s+|\s+$/gm, '')
  },
  cli = require('../../lib')

describe('External config file', function() {
  it('generate the tags using custom parsers in the config file', function(done) {
    cli._cli([
      '--config',
      'test/fixtures/config-parsers'
    ])

    setImmediate(function() {
      expect(test('-e', `${GENERATED_FOLDER}/config-file/parsers.js`)).to.be(true)
      expect(trim(cat(`${GENERATED_FOLDER}/config-file/parsers.js`)))
        .to
        .be(trim(cat(`${EXPECTED_FOLDER}/config-file/parsers.js`)))
      done()
    })


  })

  it('generate the tags using custom pug parser', function(done) {
    cli._cli([
      '--config',
      'test/fixtures/config-parsers-pug'
    ])

    setImmediate(function() {
      expect(test('-e', `${GENERATED_FOLDER}/config-file/parsers-pug.js`)).to.be(true)
      expect(trim(cat(`${GENERATED_FOLDER}/config-file/parsers-pug.js`)))
        .to
        .be(trim(cat(`${EXPECTED_FOLDER}/config-file/parsers-pug.js`)))
      done()
    })

  })

  after(function() {
    rm(`${GENERATED_FOLDER}/config-file/*`)
  })
})