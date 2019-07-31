import request from 'request'
import fs from 'fs'

import db from 'app/db'
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

        const contentType = response.headers['content-type']
        let fileType = ''

        if (contentType) {
          fileType = response.headers['content-type'].split('/')[1]
        } else {
          fileType = memeUrl.split('.').pop().toLowerCase()
        }

        const supportedFileTypes = ['jpg', 'jpeg', 'png', 'gif']
        if (!supportedFileTypes.includes(fileType)) {
          channel.send(`${language['new_meme_not_created_error']} - ${language['new_meme_unsupported_filetype_error']}`)
          return
        }

        const memePath = 'custom/' + memeName + '.' + fileType
        response.pipe(fs.createWriteStream('assets/' + memePath))

        try {
          db.get('memes')
            .push({ name: memeName, path: memePath })
            .write()
        } catch (error) {
          channel.send(`${language['new_meme_not_created_error']} - ${language['new_meme_check_permissions_to_db_file_error']}`)
          return
        }

        channel.send(language['new_meme_created'])
      })
      .on('error', () => {
        channel.send(language['new_meme_request_error'])
      })
  }
}
