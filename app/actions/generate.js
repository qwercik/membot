import MemeGenerator from 'app/utils/MemeGenerator'
import FilesDownloader from 'app/utils/FilesDownloader'
import db from 'app/db'
import language from 'app/language'
import config from 'config/config.json'

function isHttpUrl (text) {
  const pattern = /https?:\/\/(www\.)?[-a-za-z0-9@:%._+~#=]{1,256}\.[a-za-z0-9()]{1,6}\b([-a-za-z0-9()@:%_+.~#?&//=]*)/
  return pattern.test(text)
}

async function getMemeFromUrl (url) {
  const file = await FilesDownloader.download(url, config['memesFilesPath'], 'temp') // Zmienić nazwę
  return file.path
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

    let path
    if (isHttpUrl(memeReference)) {
      try {
        path = await getMemeFromUrl(memeReference)
      } catch (error) {
        channel.send(error.message)
        return
      }
    } else {
      const meme = db.get('memes')
        .find({ name: memeReference })
        .value()

      if (!meme) {
        channel.send(language['meme_not_registered_in_config'])
        return
      }

      path = config['memesFilesPath'] + meme.path
    }

    let generatedMeme
    try {
      generatedMeme = await MemeGenerator.generate(path, topText, bottomText)
    } catch (error) {
      channel.send(error.message)
      return
    }

    channel.send({
      files: [{
        attachment: generatedMeme
      }]
    }).catch(() => {
      channel.send(language['meme_file_loading_error'])
    })
  }
}
