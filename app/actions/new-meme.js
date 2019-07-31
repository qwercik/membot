import request from 'request'
import fs from 'fs'

import memesStorage from 'app/utils/MemesStorage'
import language from 'app/language'

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

    request.get({ url: memeUrl })
      .on('response', async response => {
        if (response.statusCode !== 200) {
          channel.send(language['new_meme_resource_not_exist_error'])
          return
        }

        const fileType = response.headers['content-type'].split('/')[1]
        const supportedFileTypes = ['jpeg', 'png', 'gif']
        if (!supportedFileTypes.includes(fileType)) {
          channel.send(`${language['new_meme_not_created_error']} - ${language['new_meme_unsupported_filetype_error']}`)
          return
        }

        const memePath = 'custom/' + memeName + '.' + fileType
        response.pipe(fs.createWriteStream('assets/' + memePath))

        try {
          await memesStorage.set({
            name: memeName,
            path: memePath
          })
        } catch (error) {
          channel.send(language['new_meme_not_created_error'])
          return
        }

        channel.send(language['new_meme_created'])
      })
      .on('error', () => {
        channel.send(language['new_meme_request_error'])
      })
  }
}
