import Action from '#app/plugin-system/Action.js'
import db from '#app/db.js'
import language from '#app/language/index.js'

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

    const picturesList = db.data.pictures
      .map(picture => picture.name)
      .join(', ')

    await channel.send(`${language('pictures_list_info')}: ${picturesList}`)
  }
}
