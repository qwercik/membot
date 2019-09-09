import DiscordCommandParser from 'discord-command-parser'

function parse (rawMessage, prefix) {
  const message = DiscordCommandParser.parse(rawMessage, prefix)

  return {
    rawMessage,
    prefix,
    command: message.command || '',
    action: message.arguments[0] || '',
    arguments: message.arguments.slice(1).map(arg => arg || ''),
    isCommand: message.success
  }
}

export default { parse }
