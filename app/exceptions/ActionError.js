export default class ActionError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ActionError'
  }
}