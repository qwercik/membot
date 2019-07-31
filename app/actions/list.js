import db from 'app/db'
import language from 'app/language'

export default {
  command: ['membot', 'm'],
  action: ['list', 'l'],
  description: language['action_list_description'],
  arguments: [],
  callback: async function (parsed) {
    const channel = parsed.message.channel

    const memesList = db.get('memes')
      .map('name')
      .value()
      .join(', ')

    channel.send(`${language['memes_list_info']}: ${memesList}`)
  }
}
