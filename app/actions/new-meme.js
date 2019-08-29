import config from 'config/config.json'
import db from 'app/db'
import language from 'app/language'
import FilesDownloader from 'app/utils/FilesDownloader'

export default {
  command: ['membot', 'm'],
  action: ['new-meme', 'n'],
  description: language['action_new-meme_description'],
  arguments: [
    { name: 'memeName', pattern: /^(?!\s*$).+/ },
    { name: 'memeUrl', pattern: /https?:\/\/(www\.)?[-a-za-z0-9@:%._+~#=]{1,256}\.[a-za-z0-9()]{1,6}\b([-a-za-z0-9()@:%_+.~#?&//=]*)/ }
  ],
  callback: async function (parsed) {
    const channel = parsed.message.channel

    const { memeName, memeUrl } = parsed.arguments

    const meme = db.get('memes')
      .find({ name: memeName })
      .value()

    if (meme !== undefined) {
      channel.send(`${language['new_meme_not_created_error']} - ${language['meme_with_the_given_name_exists']}`)
      return
    }

    let memePath
    try {
      memePath = await FilesDownloader.download(memeUrl, config['memesFilesPath'], memeName)
    } catch (error) {
      channel.send(error)
      return
    }

    try {
      db.get('memes')
        .push({ name: memeName, path: memePath })
        .write()
    } catch (error) {
      channel.send(`${language['new_meme_not_created_error']} - ${language['check_permissions_to_db_file_error']}`)
      return
    }

    channel.send(language['new_meme_created'])
  }
}
