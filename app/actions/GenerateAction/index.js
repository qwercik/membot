import path from 'node:path'
import MemeGenerator from '#app/utils/MemeGenerator.js'
import PicturesManager from '#app/utils/PicturesManager.js'
import db from '#app/db.js'
import language from '#app/language/index.js'
import config from '#app/config.js'
import Action from '#app/plugin-system/Action.js'
import ActionError from '#app/exceptions/ActionError.js'

function generatePictureName () {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
}

function isHttpUrl (text) {
  const pattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[-a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
  return pattern.test(text)
}

export default class GenerateAction extends Action {
  getName () {
    return 'generate'
  }

  getAliases () {
    return ['g']
  }

  getDescription () {
    return language('action_generate_description')
  }

  getArguments () {
    return [
      { name: 'pictureReference', pattern: /^(?!\s*$).+/, description: language('picture_reference_argument_description') },
      { name: 'topText', pattern: /^.*$/, description: language('top_text_argument_description') },
      { name: 'bottomText', pattern: /^.*$/, description: language('bottom_text_argument_description') }
    ]
  }

  async callback (message) {
    const channel = message.rawMessage.channel
    const { pictureReference, topText, bottomText } = message.arguments

    let picture
    let pictureName
    if (isHttpUrl(pictureReference)) {
      pictureName = generatePictureName()
      picture = await PicturesManager.create(pictureName, pictureReference)
    } else {
      pictureName = pictureReference
      picture = db.data.pictures.find(candidate => candidate.name === pictureName)

      if (!picture) {
        await channel.send(language('picture_not_registered_in_config'))
        return
      }
    }

    const picturePath = path.join(config('picturesFilesPath'), picture.filename)
    const generatedMeme = await MemeGenerator.generate(picturePath, topText, bottomText)

    try {
      await channel.send({
        files: [{
          attachment: generatedMeme,
          name: 'meme.jpg'
        }]
      })
    } catch (error) {
      throw new ActionError(language('picture_file_loading_error'))
    }

    if (isHttpUrl(pictureReference)) {
      await PicturesManager.remove(pictureName)
    }
  }
}
