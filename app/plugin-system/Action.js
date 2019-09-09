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

  isCalled (message) {
    return this.getAliases().concat([this.getName()]).includes(message.action)
  }
}