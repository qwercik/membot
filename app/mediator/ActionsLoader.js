import fs from 'fs'
import util from 'util'
import ApplicationError from 'app/exceptions/ApplicationError'
import ActionValidator from 'app/mediator/ActionValidator'
import language from '../language'
import { forceEndingWith } from 'app/utils'

const readdir = util.promisify(fs.readdir)

export default class ActionsLoader {
  constructor (actionsDirectory) {
    this.actionsDirectory = forceEndingWith(actionsDirectory, '/')
  }

  async getActionsList () {
    let actions = []
    try {
      actions = (await readdir('app/actions')).filter(name => name.endsWith('.js'))
    } catch (error) {
      throw new ApplicationError(language('actions_list_load_error'))
    }

    return actions
  }

  async loadActionsModules (actionsHandler) {
    const actions = await this.getActionsList()

    for (const actionName of actions) {
      let action
      try {
        const path = this.actionsDirectory + actionName
        const ActionClass = (await import(path)).default
        action = new ActionClass()
      } catch (error) {
        throw new ApplicationError(`${language('action_load_error')} ${action}`)
      }

      ActionValidator.validate(action)
      actionsHandler.addAction(action)
    }
  }
}
