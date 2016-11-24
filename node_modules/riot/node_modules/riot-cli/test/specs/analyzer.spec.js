require('shelljs/global')

const ANALYZER_TAGS_FOLDER = 'test/tags/analyzer/',
  analyzer = require('../../lib/analyzer')

describe('Analyzer', () => {

  it('returns no error if the tag is valid', () => {
    var errors = analyzer(cat(`${ANALYZER_TAGS_FOLDER}valid.tag`)).filter((r) => r.error )
    expect(errors.length).to.equal(0)
  })
  it('returns an error if the tag is not closed', () => {
    var results = analyzer(cat(`${ANALYZER_TAGS_FOLDER}tag-not-closed.tag`))
    expect(results[3].error).to.equal('Last tag definition is not closed')
  })
  it('returns an error if there are unmatched closing tags', () => {
    var results = analyzer(cat(`${ANALYZER_TAGS_FOLDER}tag-unmatch.tag`))
    expect(results[3].error).to.equal('Closing tag unmatch')
    expect(results[5].error).to.equal('Last tag definition is not closed')
  })
  it('returns an error within a line tag', () => {
    var results = analyzer(cat(`${ANALYZER_TAGS_FOLDER}one-line.tag`))
    expect(results).to.have.length(2)
  })
  it('returns an error if there are invalid tag fragments', () => {
    var results = analyzer(cat(`${ANALYZER_TAGS_FOLDER}invalid.tag`))
    expect(results[5].error).to.equal('Indentation needed within tag definition')
    expect(results[10].error).to.equal('Invalid tag fragment')
    expect(results[16].error).to.equal('Invalid tag fragment')
  })

})