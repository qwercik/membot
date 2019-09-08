import Action from 'app/mediator/Action'
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

  async callback (parsed) {
    const channel = parsed.message.channel

    const picturesList = db.get('pictures')
      .map('name')
      .value()
      .join(', ')

    channel.send(`${language('pictures_list_info')}: ${picturesList}`)
  }
}
