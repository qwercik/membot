import language from 'app/language'
import ActionError from 'app/exceptions/ActionError'

export default class ActionsHandler {
  constructor (command) {
    this.actions = []
    this.command = command
  }

  addAction (action) {
    this.actions.push(action)
    return this
  }

  getActions () {
    return this.actions
  }

  async handle (message) {
    if (!this.command.isCalled(message)) {
      return
    }

    const action = this.actions.find(el => el.isCalled(message))
    if (!action) {
      throw new ActionError(language('unknown_command_error'))
    }

    const argumentsObject = {}
    const actionArguments = action.getArguments()
    for (let index = 0; index < action.getArguments().length; ++index) {
      const name = actionArguments[index].name
      const pattern = actionArguments[index].pattern
      const value = message.arguments[index] || ''

      if (!pattern.test(value)) {
        throw new ActionError(language('incorrect_usage_error'))
      }

      argumentsObject[name] = value
    }

    message.arguments = argumentsObject
    await action.callback(message, this)
  }
}
