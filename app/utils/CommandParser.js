import DiscordCommandParser from 'discord-command-parser'
import config from 'config/config'

function parse (message) {
  const prefix = config['commandPrefix']
  const parsed = DiscordCommandParser.parse(message, prefix)

  return {
    isCommand: parsed.success,
    prefix,
    command: parsed.command,
    action: parsed.arguments[0],
    arguments: parsed.arguments.slice(1).map(arg => arg || ''),
    message: parsed.message
  }
}

export default { parse }
