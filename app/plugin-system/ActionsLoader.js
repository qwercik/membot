import fs from 'fs'
import ApplicationError from 'app/exceptions/ApplicationError'
import ActionValidator from 'app/plugin-system/ActionValidator'
import language from 'app/language'
import { forceEndingWith } from 'app/utils'

export default class ActionsLoader {
  constructor (actionsDirectory) {
    this.actionsDirectory = forceEndingWith(actionsDirectory, '/')
  }

  async getActionsFilesList () {
    let actions = []
    try {
      actions = fs.readdirSync(this.actionsDirectory).map(name => {
        const parts = name.split('.')
        if (parts.length === 1) {
          return name
        }

        return name.split('.').slice(0, -1)
      })
    } catch (error) {
      throw new ApplicationError(language('actions_list_load_error'))
    }

    return actions
  }

  async loadActionsModules (actionsHandler) {
    const files = await this.getActionsFilesList()

    for (const fileName of files) {
      let action
      try {
        const path = this.actionsDirectory + fileName
        const ActionClass = (await import(path)).default
        action = new ActionClass()
      } catch (error) {
        throw new ApplicationError(`${language('action_load_error')} ${fileName}`)
      }

      ActionValidator.validate(action)
      actionsHandler.addAction(action)
    }
  }
}
