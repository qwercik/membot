import FilesDownloader from 'app/utils/FilesDownloader'
import config from 'config/config.json'
import language from 'app/language'
import db from 'app/db'
import fs from 'fs'

function getMemeByName (memeName) {
  const meme = db.get('memes')
    .find({ name: memeName })
    .value()

  return meme
}

function createFile (memeName, url) {
  return FilesDownloader.download(url, config['memesFilesPath'], memeName)
}

function removeFile (fileName) {
  return new Promise((resolve, reject) => {
    const path = config['memesFilesPath'] + fileName

    fs.unlink(path, error => {
      if (error) {
        reject(new Error(language['remove_meme_file_error']))
      }

      resolve()
    })
  })
}

function create (memeName, url) {
  return new Promise((resolve, reject) => {
    const meme = getMemeByName(memeName)

    if (meme === undefined) {
      createFile(memeName, url)
        .then(file => {
          const meme = { name: memeName, filename: file.name }

          db.get('memes')
            .push(meme)
            .write()

          resolve(meme)
        })
        .catch(reject)
    } else {
      reject(new Error(`${language['new_meme_not_created_error']} - ${language['meme_with_the_given_name_exists']}`))
    }
  })
}

function remove (memeName) {
  return new Promise((resolve, reject) => {
    const meme = getMemeByName(memeName)
    if (meme === undefined) {
      reject(new Error(language['meme_not_registered_in_config']))
    } else {
      removeFile(meme.filename)
        .then(() => {
          const removed = db.get('memes')
            .remove({ name: memeName })
            .write()

          if (removed.length > 0) {
            resolve()
          } else {
            reject(new Error(language['meme_not_registered_in_config']))
          }
        })
        .catch(reject)
    }
  })
}

export default { create, remove }
