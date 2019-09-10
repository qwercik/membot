export default class Command {
  constructor (name, aliases) {
    this.name = name
    this.aliases = aliases
  }

  getAllReferenceNames () {
    return this.aliases.concat([this.name])
  }

  isCalled (message) {
    return message.isCommand && this.getAllReferenceNames().includes(message.command)
  }
}
