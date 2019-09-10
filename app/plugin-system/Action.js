export default class Action {
  getName () {
    return ''
  }

  getAliases () {
    return []
  }

  getDescription () {
    return ''
  }

  getArguments () {
    return []
  }

  getAllReferenceNames () {
    return this.getAliases().concat([this.getName()])
  }

  isCalled (message) {
    return this.getAllReferenceNames().includes(message.action)
  }
}
