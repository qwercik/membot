import Action from 'app/plugin-system/Action'
import db from 'app/db'
import language from 'app/language'

export default class ListAction extends Action {
  getName () {
    return 'list'
  }

  getAliases () {
    return ['l']
  }

  getDescription () {
    return language('action_list_description')
  }

  async callback (message) {
    const channel = message.rawMessage.channel

    const picturesList = db.get('pictures')
      .map('name')
      .value()
      .join(', ')

    channel.send(`${language('pictures_list_info')}: ${picturesList}`)
  }
}
