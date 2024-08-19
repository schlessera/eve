import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('help', () => {
  it('runs help', async () => {
    const {stdout} = await runCommand('help')
    expect(stdout).to.contain('Enhanced Virtual Entity')
    expect(stdout).to.contain('help')
  })
})
