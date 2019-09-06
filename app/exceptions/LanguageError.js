export default class LanguageError extends Error {
  constructor (message) {
    super(message)
    this.name = 'LanguageError'
  }
}