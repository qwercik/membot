import language from 'app/language'
import PicturesManager from 'app/utils/PicturesManager'

export default {
  command: ['membot', 'm'],
  action: ['remove-picture', 'r'],
  description: language('action_remove-picture_description'),
  arguments: [
    { name: 'pictureName', pattern: /^(?!\s*$).+/ }
  ],
  callback: async function (parsed) {
    const channel = parsed.message.channel
    const { pictureName } = parsed.arguments

    try {
      await PicturesManager.remove(pictureName)
      channel.send(language('picture_removed'))
    } catch (error) {
      channel.send(error.message)
    }
  }
}
