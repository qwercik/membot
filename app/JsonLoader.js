import fs from 'node:fs'
import ApplicationError from '#app/exceptions/ApplicationError.js'

export default class JsonLoader {
  constructor (errorMessages) {
    this.errorMessages = errorMessages
  }

  loadFromFile (path) {
    let content
    try {
      content = fs.readFileSync(path, 'utf8')
    } catch (error) {
      throw new ApplicationError(this.errorMessages.fileNotExist)
    }

    try {
      this.json = JSON.parse(content)
    } catch (error) {
      throw new ApplicationError(this.errorMessages.syntaxError)
    }
  }

  getProperty (key) {
    if (!this.json) {
      throw new ApplicationError(this.errorMessages.fileNotLoaded)
    }

    const property = this.json[key]
    if (property === undefined) {
      throw new ApplicationError(this.errorMessages.propertyNotExist.replace('{key}', key))
    }

    return property
  }
}
