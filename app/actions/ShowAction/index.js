import path from 'node:path'
import db from '#app/db.js'
import config from '#app/config.js'
import language from '#app/language/index.js'
import Action from '#app/plugin-system/Action.js'
import ActionError from '#app/exceptions/ActionError.js'

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
      { name: 'pictureName', pattern: /^(?!\s*$).+/, description: language('picture_name_argument_description') }
    ]
  }

  async callback (message) {
    const channel = message.rawMessage.channel

    const { pictureName } = message.arguments
    const picture = db.data.pictures.find(candidate => candidate.name === pictureName)

    if (!picture) {
      await channel.send(language('picture_not_registered_in_config'))
      return
    }

    try {
      await channel.send({
        files: [{
          attachment: path.join(config('picturesFilesPath'), picture.filename),
          name: picture.filename
        }]
      })
    } catch (error) {
      throw new ActionError(language('picture_file_loading_error'))
    }
  }
}
