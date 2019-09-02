import language from 'app/language'
import MemesManager from 'app/utils/MemesManager'

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

    try {
      await MemesManager.remove(memeName)
      channel.send(language['meme_removed'])
    } catch (error) {
      channel.send(error.message)
    }
  }
}
