import language from 'app/language'
import ActionError from 'app/exceptions/ActionError'

export default class ActionsHandler {
  constructor (commands) {
    this.actions = []
    this.commands = commands
  }

  addAction (action) {
    this.actions.push(action)
    return this
  }

  async handle (parsed) {
    if (!parsed.isCommand || !this.commands.includes(parsed.command)) {
      return
    }

    const action = this.actions.find(el => el.isCalled(parsed))
    if (!action) {
      throw new ActionError(language('unknown_command_error'))
    }

    const argumentsObject = {}
    const actionArguments = action.getArguments()
    for (let index = 0; index < action.getArguments().length; ++index) {
      const name = actionArguments[index].name
      const pattern = actionArguments[index].pattern
      const value = parsed.arguments[index] || ''

      if (!pattern.test(value)) {
        throw new ActionError(language('incorrect_usage_error'))
      }

      argumentsObject[name] = value
    }

    parsed.arguments = argumentsObject
    await action.callback(parsed, this)
  }
}
