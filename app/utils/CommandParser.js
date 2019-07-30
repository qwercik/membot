import DiscordCommandParser from 'discord-command-parser'

function parse (message, prefix) {
  const parsed = DiscordCommandParser.parse(message, prefix)

  return {
    isCommand: parsed.success,
    prefix: parsed.prefix,
    command: parsed.command,
    action: parsed.arguments[0],
    arguments: parsed.arguments.slice(1).map(arg => arg || ''),
    message: parsed.message
  }
}

export default { parse }
