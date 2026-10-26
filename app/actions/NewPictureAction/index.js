import language from '#app/language/index.js'
import PicturesManager from '#app/utils/PicturesManager.js'
import Action from '#app/plugin-system/Action.js'

export default class NewPictureAction extends Action {
  getName () {
    return 'new-picture'
  }

  getAliases () {
    return ['n']
  }

  getDescription () {
    return language('action_new-picture_description')
  }

  getArguments () {
    return [
      { name: 'pictureName', pattern: /^(?!\s*$).+/, description: language('picture_name_argument_description') },
      { name: 'pictureUrl', pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[-a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, description: language('picture_url_argument_description') }
    ]
  }

  async callback (message) {
    const channel = message.rawMessage.channel
    const { pictureName, pictureUrl } = message.arguments

    await PicturesManager.create(pictureName, pictureUrl)
    await channel.send(language('new_picture_created'))
  }
}
