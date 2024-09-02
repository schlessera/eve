import {Hook} from '@oclif/core'

const hook: Hook<'command_not_found'> = async function (opts) {
  // If the command is not found, we will assume the cat command is being used.
  // In this case, the command that was typed is actually the first word of the user message.
  let message = opts.id;
  // If there are additional arguments, we will add them to the message.
  if (opts.argv && opts.argv.length > 0) {
    message += ' ' + opts.argv.join(' ')
  }
  // We will then run the chat command with the rest of the message as the argument.
  await this.config.runCommand('chat', [message])
  // We will then exit the process.
  process.exit(0)
}

export default hook
