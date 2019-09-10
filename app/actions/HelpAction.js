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
      { name: 'actionName', pattern: /^.*$/, description: language('action_name_argument_description') }
    ]
  }

  async callback (message, handler) {
    const { channel, author } = message.rawMessage
    const { actionName } = message.arguments
    const actionsList = handler.getActions()

    if (actionName === '') {
      const actionsListString = actionsList.map(action => `${action.getName()} - ${action.getDescription()}`).join('\n')

      const helpMessage = dedent`
        Witaj! Ten bot umożliwia Ci generowanie memów z zapisanych wcześniej obrazków lub bezpośrednio z adresu URL. Oto krótka instrukcja obsługi:
        Każda komenda ma następujący format:
        <prefix> <komenda> <akcja> [argumenty]
        W tym przypadku:
        ${message.rawMessage}
        W sytuacji, gdy jako argument chciałbyś przekazać więcej, niż jeden wyraz, obejmij tekst przy pomocy cudzysłowów.
        Poniżej znajduje lista akcji. Każda z nich posiada swoją unikalną nazwę, jednocześnie może mieć przypisane aliasy. Dzięki nim, polecenia stają się krótsze.
        
        ${actionsListString}
      `

      try {
        await author.send(helpMessage)
      } catch (error) {
        throw new ActionError(`${author}, bardzo proszę Cię o odblokowanie wiadomości prywatnych. Inaczej nie będziesz mógł przeczytać instrukcji :cry:`)
      }

      channel.send(`${author}, wysłałem Ci instrukcję w wiadomości prywatnej :wink:`)

    } else {
      const action = actionsList.find(action => action.getAllReferenceNames().includes(actionName))
      if (action === undefined) {
        throw new ActionError(language('action_not_exist'))
      }

      const argumentsString = action.getArguments().map(argument => `- ${argument.name} - ${argument.description}`).join('\n')

      const actionString = dedent`
        Akcja: ${action.getName()}
        Aliasy: ${action.getAliases().join(', ')}
        Argumenty:
        ${argumentsString}
        Opis: ${action.getDescription()}
      `

      channel.send(actionString)
    }
  }
}
