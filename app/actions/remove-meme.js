import db from 'app/db'
import language from 'app/language'

export default {
  command: ['membot', 'm'],
  action: ['remove-meme', 'r'],
  description: language['action_remove-meme_description'],
  arguments: [
    { name: 'memeName', pattern: /^(?!\s*$).+/ }
  ],
  callback: async function (parsed) {
    const channel = parsed.message.channel

    const { memeName } = parsed.arguments

    const removed = db.get('memes')
      .remove({ name: memeName })
      .write()

    if (removed.length > 0) {
      channel.send(language['meme_removed'])
    } else {
      channel.send(language['meme_not_registered_in_config'])
    }
  }
}
