import language from 'app/language'
import PicturesManager from 'app/utils/PicturesManager'
import Action from 'app/plugin-system/Action'

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
      { name: 'pictureName', pattern: /^(?!\s*$).+/ },
      { name: 'pictureUrl', pattern: /https?:\/\/(www\.)?[-a-za-z0-9@:%._+~#=]{1,256}\.[a-za-z0-9()]{1,6}\b([-a-za-z0-9()@:%_+.~#?&//=]*)/ }
    ]
  }

  async callback (message) {
    const channel = message.rawMessage.channel
    const { pictureName, pictureUrl } = message.arguments

    await PicturesManager.create(pictureName, pictureUrl)
    channel.send(language('new_picture_created'))
  }
}
