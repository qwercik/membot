export default class Command {
  constructor (name, aliases) {
    this.name = name
    this.aliases = aliases
  }

  isCalled (message) {
    return message.isCommand && this.aliases.concat([this.name]).includes(message.command)
  }
}