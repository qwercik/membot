import language from 'app/language'
import PicturesManager from 'app/utils/PicturesManager'

export default {
  actions: ['new-picture', 'n'],
  description: language('action_new-picture_description'),
  arguments: [
    { name: 'pictureName', pattern: /^(?!\s*$).+/ },
    { name: 'pictureUrl', pattern: /https?:\/\/(www\.)?[-a-za-z0-9@:%._+~#=]{1,256}\.[a-za-z0-9()]{1,6}\b([-a-za-z0-9()@:%_+.~#?&//=]*)/ }
  ],
  callback: async function (parsed) {
    const channel = parsed.message.channel
    const { pictureName, pictureUrl } = parsed.arguments

    try {
      await PicturesManager.create(pictureName, pictureUrl)
      channel.send(language('new_picture_created'))
    } catch (error) {
      channel.send(error.message)
    }
  }
}
