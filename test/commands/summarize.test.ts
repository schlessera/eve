import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('summarize', () => {
  it('runs summarize', async () => {
    const {stderr, stdout} = await runCommand('summarize "The piece of paper is white. The piece of paper is empty. The piece of paper is rectangular."')
    expect(stderr).to.be.empty
    expect(stdout).to.contain('paper')
  })
})
