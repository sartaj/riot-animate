require('shelljs/global')

const EXPECTED_LOGS_DIR = 'test/expected/logs',
  GENERATED_LOGS_DIR = 'test/generated/logs'

describe('output logs', () => {
  it('All the cli output logs are fine', () => {
    var logs = ls(EXPECTED_LOGS_DIR)
    logs.forEach((log) => {
      expect(cat(`${EXPECTED_LOGS_DIR}/${log}`).toString()).to.be(cat(`${GENERATED_LOGS_DIR}/${log}`).toString())
    })
  })
})