import language from 'app/language'
import PicturesManager from 'app/utils/PicturesManager'
import Action from 'app/mediator/Action'

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
    return { name: 'pictureName', pattern: /^(?!\s*$).+/ }
  }

  async callback (parsed) {
    const channel = parsed.message.channel
    const { pictureName } = parsed.arguments

    await PicturesManager.remove(pictureName)
    channel.send(language('picture_removed'))
  }
}
