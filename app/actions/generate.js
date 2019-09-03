import MemeGenerator from 'app/utils/MemeGenerator'
import MemesManager from 'app/utils/MemesManager'
import db from 'app/db'
import language from 'app/language'
import config from 'config/config.json'

function generateMemeName () {
  const date = new Date()
  const formatted = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
  return formatted
}

function isHttpUrl (text) {
  const pattern = /https?:\/\/(www\.)?[-a-za-z0-9@:%._+~#=]{1,256}\.[a-za-z0-9()]{1,6}\b([-a-za-z0-9()@:%_+.~#?&//=]*)/
  return pattern.test(text)
}

export default {
  command: ['membot', 'm'],
  action: ['generate', 'g'],
  description: language['action_generate_description'],
  arguments: [
    { name: 'memeReference', pattern: /^(?!\s*$).+/ },
    { name: 'topText', pattern: /^.*$/ },
    { name: 'bottomText', pattern: /^.*$/ }
  ],
  callback: async function (parsed) {
    const channel = parsed.message.channel
    const { memeReference, topText, bottomText } = parsed.arguments

    let meme
    let memeName
    if (isHttpUrl(memeReference)) {
      try {
        memeName = generateMemeName()
        meme = await MemesManager.create(memeName, memeReference)
      } catch (error) {
        channel.send(error.message)
        return
      }
    } else {
      memeName = memeReference
      meme = db.get('memes')
        .find({ name: memeName })
        .value()

      if (!meme) {
        channel.send(language['meme_not_registered_in_config'])
        return
      }
    }

    const path = config['memesFilesPath'] + meme.path

    let generatedMeme
    try {
      generatedMeme = await MemeGenerator.generate(path, topText, bottomText)
    } catch (error) {
      channel.send(error.message)
      return
    }

    try {
      channel.send({
        files: [{
          attachment: generatedMeme
        }]
      })
    } catch (error) {
      channel.send(language['meme_file_loading_error'])
      return
    }

    if (isHttpUrl(memeReference)) {
      try {
        await MemesManager.remove(memeName)
      } catch (error) {
        channel.send(error.message)
      }
    }
  }
}
