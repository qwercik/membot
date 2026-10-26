import language from '#app/language/index.js'
import PicturesManager from '#app/utils/PicturesManager.js'
import Action from '#app/plugin-system/Action.js'

export default class RemovePictureAction extends Action {
  getName () {
    return 'remove-picture'
  }

  getAliases () {
    return ['r']
  }

  getDescription () {
    return language('action_remove-picture_description')
  }

  getArguments () {
    return [{ name: 'pictureName', pattern: /^(?!\s*$).+/, description: language('picture_name_argument_description') }]
  }

  async callback (message) {
    const channel = message.rawMessage.channel
    const { pictureName } = message.arguments

    await PicturesManager.remove(pictureName)
    await channel.send(language('picture_removed'))
  }
}
