import DiscordCommandParser from 'discord-command-parser'

export default class Message {
  constructor (rawMessage, prefix) {
    const parsed = DiscordCommandParser.parse(rawMessage, prefix)

    this.rawMessage = rawMessage
    this.prefix = prefix
    this.command = parsed.command || ''
    this.action = parsed.arguments[0] || ''
    this.arguments = parsed.arguments.slice(1).map(arg => arg || '')
    this.isCommand = parsed.success
  }

  isPrivate () {
    return this.rawMessage.channel.type === 'dm'
  }
}
