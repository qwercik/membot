import db from 'app/db'
import language from 'app/language'

export default {
  name: 'show',
  aliases: ['s'],
  description: language('action_show_description'),
  arguments: [
    { name: 'pictureName', pattern: /^(?!\s*$).+/ }
  ],
  callback: async function (parsed) {
    const channel = parsed.message.channel

    const { pictureName } = parsed.arguments
    const picture = db.get('pictures')
      .find({ name: pictureName })
      .value()

    if (!picture) {
      channel.send(language('picture_not_registered_in_config'))
      return
    }

    try {
      channel.send({
        files: [{
          attachment: `assets/${picture.filename}`,
          name: picture.filename
        }]
      })
    } catch (error) {
      throw new Error(language('picture_file_loading_error'))
    }
  }
}
