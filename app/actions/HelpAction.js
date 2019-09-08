import Action from 'app/plugin-system/Action'
import language from 'app/language'

export default class HelpAction extends Action {
  getName () {
    return 'help'
  }

  getAliases () {
    return ['h']
  }

  getDescription () {
    return language('action_help_description')
  }

  getArguments () {
    return [
      { name: 'actionName', pattern: /^.*$/}
    ]
  }

  async callback (message, handler) {
    const channel = message.rawMessage.channel
    const { actionName } = message.arguments

    if (actionName === '') {
      const message = 'Lista akcji: ' + handler.actions.map(action => action.getName()).join(', ') + '\n'
        + 'Wpisz !help <nazwa akcji> aby dowiedzieć się czegoś więcej o którejś z akcji'

      channel.send(message)
    } else {
      channel.send(handler.actions.find(action => action.isCalled(message)).getDescription())
    }
  }
}
