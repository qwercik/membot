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
    
    const action = this.actions.find(el => el.aliases.concat([el.name]).includes(parsed.action))
    if (!action) {
      throw new ActionError(language('unknown_command_error'))
    }

    const argumentsObject = {}
    for (let index = 0; index < action.arguments.length; ++index) {
      const name = action.arguments[index].name
      const pattern = action.arguments[index].pattern
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
