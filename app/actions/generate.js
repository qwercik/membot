import MemeGenerator from 'app/utils/MemeGenerator'
import db from 'app/db'
import language from 'app/language'

export default {
  command: ['membot', 'm'],
  action: ['generate', 'g'],
  description: language['action_generate_description'],
  arguments: [
    { name: 'memeName', pattern: /^(?!\s*$).+/ },
    { name: 'topText', pattern: /^.*$/ },
    { name: 'bottomText', pattern: /^.*$/ }
  ],
  callback: async function (parsed) {
    const channel = parsed.message.channel

    const { memeName, topText, bottomText } = parsed.arguments

    const meme = db.get('memes')
      .find({ name: memeName })
      .value()

    if (!meme) {
      channel.send(language['meme_not_registered_in_config'])
      return
    }

    const generatedMeme = await MemeGenerator.generate(meme.path, topText, bottomText)
      .catch(error => {
        channel.send(error)
      })

    channel.send({
      files: [{
        attachment: generatedMeme
      }]
    }).catch(() => {
      channel.send(language['meme_file_loading_error'])
    })
  }
}
