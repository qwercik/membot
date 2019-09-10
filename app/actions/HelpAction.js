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

      try {
        await author.send({
          embed: {
            color: 0x40ABF7,
            title: 'Instrukcja korzystania z bota',
            description: 'Witaj! Ten bot umożliwia Ci generowanie memów z zapisanych wcześniej obrazków lub bezpośrednio z adresu URL. Poniżej znajduje się krótka instrukcja obsługi.',
            fields: [
              { name: 'Składnia poleceń', value: 'Każda komenda ma następujący format:\n<prefix><komenda> <akcja> [argumenty]\nKomenda, akcja oraz poszczególne argumenty, rozdzielane są spacjami. Aby w jednym argumencie zawrzeć kilka argumentów, należy zawrzeć jego treść w cudzysłowy.' },
              { name: 'Aliasy', value: 'Do komendy oraz akcji odwołujemy się podając jej nazwę. Istnieje jednak możliwość tworzenia aliasów dla poszczególnych komend. Dzięki nim, można stosować krótsze nazwy.' },
              { name: 'Przykłady', value: '!membot generate nosacz "Kiedyś to było" "Kuurła"\n!m g pechowiec-brian Usunął "katalog .git/"' },
              { name: 'Lista akcji', value: actionsListString },
              { name: 'Dowiedz się więcej', value: 'Aby dowiedzieć się czegoś więcej o którejś z akcji, użyj komendy !membot help <akcja>\nNa przykład: !membot help generate' }
            ]
          }
        })
      } catch (error) {
        throw new ActionError(`${author}, bardzo proszę Cię o odblokowanie wiadomości prywatnych. Inaczej nie będziesz mógł przeczytać instrukcji :cry:`)
      }

      if (!message.isPrivate()) {
        channel.send(`${author}, wysłałem Ci instrukcję w wiadomości prywatnej :wink:`)
      }
    } else {
      const action = actionsList.find(action => action.getAllReferenceNames().includes(actionName))
      if (action === undefined) {
        throw new ActionError(language('action_not_exist'))
      }

      const allReferenceNamesString = action.getAllReferenceNames().join(', ')
      const argumentsString = action.getArguments().map(argument => `${argument.name} - ${argument.description}`).join('\n') || 'Brak argumentów'

      channel.send({
        embed: {
          color: 0x40ABF7,
          title: `Akcja ${action.getName()}`,
          description: action.getDescription(),
          fields: [
            { name: 'Dostępne aliasy', value: `Do tej akcji możesz odwoływać się poprzez jedną z następujących nazw: ${allReferenceNamesString}` },
            { name: 'Argumenty', value: argumentsString }
          ]
        }
      })
    }
  }
}
