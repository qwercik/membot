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

  isCalled (parsed) {
    return this.getAliases().concat([this.getName()]).includes(parsed.action)
  }
}