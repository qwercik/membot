import fs from 'fs'
import util from 'util'
import ApplicationError from 'app/exceptions/ApplicationError'
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
      actions = await readdir('app/actions')
    } catch (error) {
      throw new ApplicationError(language('actions_list_load_error'))
    }

    return actions
  }

  async loadActionsModules (actionsHandler) {
    const actions = await this.getActionsList()

    for (const action of actions) {
      try {
        const path = this.actionsDirectory + action
        const module = (await import(path)).default

        actionsHandler.addAction(module)
      } catch (error) {
        throw new ApplicationError(`${language('action_load_error')} ${action}`)
      }
    }
  }
}