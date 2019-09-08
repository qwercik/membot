import db from 'app/db'
import language from 'app/language'
import Action from 'app/plugin-system/Action'

export default class ShowAction extends Action {
  getName () {
    return 'show'
  }

  getAliases () {
    return ['s']
  }

  getDescription () {
    return language('action_show_description')
  }

  getArguments () {
    return [
      { name: 'pictureName', pattern: /^(?!\s*$).+/ }
    ]
  }

  async callback (message) {
    const channel = message.rawMessage.channel

    const { pictureName } = message.arguments
    const picture = db.get('pictures')
      .find({ name: pictureName })
      .value()

    if (!picture) {
      channel.send(language('picture_not_registered_in_config'))
      return
    }

    try {
      channel.send({
        files: [{
          attachment: `assets/${picture.filename}`,
          name: picture.filename
        }]
      })
    } catch (error) {
      throw new Error(language('picture_file_loading_error'))
    }
  }
}
