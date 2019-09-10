import Action from 'app/plugin-system/Action'
import language from 'app/language'

export default class ListAction extends Action {
  getName () {
    return 'example'
  }

  getAliases () {
    return ['e']
  }

  getDescription () {
    return 'Przykładowy opis'
  }

  async callback (message) {
    const channel = message.rawMessage.channel
    channel.send('Przykładowa komenda')
  }
}
