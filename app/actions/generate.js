import MemeGenerator from 'app/utils/MemeGenerator'
import PicturesManager from 'app/utils/PicturesManager'
import db from 'app/db'
import language from 'app/language'
import config from 'config/config'

function generatePictureName () {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
}

function isHttpUrl (text) {
  const pattern = /https?:\/\/(www\.)?[-a-za-z0-9@:%._+~#=]{1,256}\.[a-za-z0-9()]{1,6}\b([-a-za-z0-9()@:%_+.~#?&//=]*)/
  return pattern.test(text)
}

export default {
  actions: ['generate', 'g'],
  description: language('action_generate_description'),
  arguments: [
    { name: 'pictureReference', pattern: /^(?!\s*$).+/ },
    { name: 'topText', pattern: /^.*$/ },
    { name: 'bottomText', pattern: /^.*$/ }
  ],
  callback: async function (parsed) {
    const channel = parsed.message.channel
    const { pictureReference, topText, bottomText } = parsed.arguments

    let picture
    let pictureName
    if (isHttpUrl(pictureReference)) {
      pictureName = generatePictureName()
      picture = await PicturesManager.create(pictureName, pictureReference)
    } else {
      pictureName = pictureReference
      picture = db.get('pictures')
        .find({ name: pictureName })
        .value()

      if (!picture) {
        channel.send(language('picture_not_registered_in_config'))
        return
      }
    }

    const path = config['picturesFilesPath'] + picture.filename
    const generatedMeme = await MemeGenerator.generate(path, topText, bottomText)

    try {
      channel.send({
        files: [{
          attachment: generatedMeme
        }]
      })
    } catch (error) {
      throw Error(language('picture_file_loading_error'))
    }

    if (isHttpUrl(pictureReference)) {
      await PicturesManager.remove(pictureName)
    }
  }
}
