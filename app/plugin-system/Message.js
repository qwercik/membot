import DiscordCommandParser from 'discord-command-parser'

export default class Message {
  constructor (rawMessage, prefix) {
    const parsed = DiscordCommandParser.parse(rawMessage, prefix)
    const argumentsList = parsed.arguments || []

    this.rawMessage = rawMessage
    this.prefix = prefix
    this.command = parsed.command || ''
    this.action = argumentsList[0] || ''
    this.arguments = argumentsList.slice(1).map(argument => argument || '')
    this.isCommand = parsed.success
  }

  isPrivate () {
    return this.rawMessage.channel.isDMBased()
  }
}
