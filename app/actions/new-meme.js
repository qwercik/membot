import language from 'app/language'
import MemesManager from 'app/utils/MemesManager'

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

    try {
      await MemesManager.create(memeName, memeUrl)
      channel.send(language['new_meme_created'])
    } catch (error) {
      channel.send(error)
    }
  }
}
