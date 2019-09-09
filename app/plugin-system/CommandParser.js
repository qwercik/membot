import DiscordCommandParser from 'discord-command-parser'
import config from 'app/config'

function parse (rawMessage) {
  const prefix = config('commandPrefix')
  const message = DiscordCommandParser.parse(rawMessage, prefix)

  return {
    rawMessage,
    prefix,
    command: message.command || '',
    action: message.arguments[0] || '',
    arguments: message.arguments.slice(1).map(arg => arg || ''),
    isCommand: message.success,
  }
}

export default { parse }
