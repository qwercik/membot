import fs from 'fs'
import path from 'path'
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
      actions = fs.readdirSync(this.actionsDirectory).filter(filename => {
        const path = this.actionsDirectory + filename
        const stat = fs.lstatSync(path)

        return (stat.isFile() && filename.endsWith('.js')) || (stat.isDirectory() && fs.existsSync(forceEndingWith(path, '/') + 'index.js'))
      })
    } catch (error) {
      console.error(error)
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
