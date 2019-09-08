import db from 'app/db'
import language from 'app/language'

export default {
  name: 'list',
  aliases: ['l'],
  description: language('action_list_description'),
  arguments: [],
  callback: async function (parsed) {
    const channel = parsed.message.channel

    const picturesList = db.get('pictures')
      .map('name')
      .value()
      .join(', ')

    channel.send(`${language('pictures_list_info')}: ${picturesList}`)
  }
}
