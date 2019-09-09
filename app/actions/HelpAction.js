import dedent from 'dedent-js'
import Action from 'app/plugin-system/Action'
import ActionError from 'app/exceptions/ActionError'
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
    const actionsList = handler.getActions()

    if (actionName === '') {
      const actionsListString = actionsList.map(action => `${action.getName()} - ${action.getDescription()}`).join('\n')

      const helpMessage = dedent`
        Witaj! Ten bot umożliwia Ci generowanie memów z zapisanych wcześniej obrazków lub bezpośrednio z URL
        Aby móc z niego korzystać, musisz nauczyć się, specyficznej dla niego, składni poleceń.\n
        Aby wyświetlić tę wiadomość, użyłeś polecenia: ${message.rawMessage}\n
        Każde polecenie zbudowane jest z - kolejno:
        prefiksu (w tym przypadku ${message.prefix}), komendy (${message.command}), akcji (${message.action})
        oraz argumentów (umieszcza się je kolejno za akcją). W sytuacji, gdy jako argument chciałbyś przekazać
        więcej, niż jeden wyraz, obejmij tekst przy pomocy cudzysłowów.
        Każda akcja może, oprócz nazwy, mieć przypisane aliasy.
        Aby dowiedzieć się więcej o danej akcji, podaj jej nazwę jako parametr.
        Oto lista akcji: \n
        ${actionsListString}
      `

      channel.send(helpMessage)
    } else {
      const action = actionsList.find(action => action.getName() === actionName)
      if (action === undefined) {
        throw new ActionError(language('action_not_exist'))
      }

      const actionString = dedent`
        Akcja: ${action.getName()}
        Aliasy: ${action.getAliases().join(', ')}
        Opis: ${action.getDescription()}
      `

      channel.send(actionString)
    }
  }
}
