import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ApplicationError from '#app/exceptions/ApplicationError.js'
import ActionValidator from '#app/plugin-system/ActionValidator.js'
import language from '#app/language/index.js'

export default class ActionsLoader {
  constructor (actionsDirectory) {
    this.actionsDirectory = path.resolve(actionsDirectory)
  }

  getActionsFilesList () {
    try {
      return fs.readdirSync(this.actionsDirectory, { withFileTypes: true })
        .filter(entry => {
          if (entry.isFile()) {
            return entry.name.endsWith('.js')
          }

          return entry.isDirectory() && fs.existsSync(path.join(this.actionsDirectory, entry.name, 'index.js'))
        })
        .map(entry => entry.name)
    } catch (error) {
      console.error(error)
      throw new ApplicationError(language('actions_list_load_error'))
    }
  }

  async loadActionsModules (actionsHandler) {
    const files = this.getActionsFilesList()

    for (const fileName of files) {
      const modulePath = path.join(this.actionsDirectory, fileName)
      const filePath = fs.statSync(modulePath).isDirectory()
        ? path.join(modulePath, 'index.js')
        : modulePath

      let action
      try {
        const ActionClass = (await import(pathToFileURL(filePath).href)).default
        action = new ActionClass()
      } catch (error) {
        throw new ApplicationError(`${language('action_load_error')} ${fileName}`)
      }

      ActionValidator.validate(action)
      actionsHandler.addAction(action)
    }
  }
}
