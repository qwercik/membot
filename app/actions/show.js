import db from 'app/db'
import language from 'app/language'

export default {
  command: ['membot', 'm'],
  action: ['show', 's'],
  description: language['action_show_description'],
  arguments: [
    { name: 'memeName', pattern: /^(?!\s*$).+/ }
  ],
  callback: async function (parsed) {
    const channel = parsed.message.channel

    const { memeName } = parsed.arguments
    const meme = db.get('memes')
      .find({ name: memeName })
      .value()

    if (!meme) {
      channel.send(language['meme_not_registered_in_config'])
      return
    }

    channel.send({
      files: [{
        attachment: `assets/${meme.path}`,
        name: meme.path
      }]
    }).catch(() => {
      channel.send(language['meme_file_loading_error'])
    })
  }
}
