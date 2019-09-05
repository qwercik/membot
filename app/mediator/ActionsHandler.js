import language from 'app/language'

export default class ActionsHandler {
  constructor (commands) {
    this.actions = []
    this.commands = commands
  }

  addAction (action) {
    this.actions.push(action)
    return this
  }

  handle (parsed) {
    const channel = parsed.message.channel

    if (!parsed.isCommand) {
      return
    }

    if (!this.commands.includes(parsed.command)) {
      return
    }

    const action = this.actions.find(el => el.actions.includes(parsed.action))

    if (!action) {
      channel.send(language('unknown_command_error'))
      return
    }

    const argumentsObject = {}

    for (let index = 0; index < action.arguments.length; ++index) {
      const name = action.arguments[index].name
      const pattern = action.arguments[index].pattern
      const value = parsed.arguments[index] || ''

      if (!pattern.test(value)) {
        channel.send(language('incorrect_usage_error'))
        return
      }

      argumentsObject[name] = value
    }

    parsed.arguments = argumentsObject

    action.callback(parsed)
  }
}
