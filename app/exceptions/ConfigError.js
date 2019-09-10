export default class ConfigError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ConfigError'
  }
}
