import FilesDownloader from 'app/utils/FilesDownloader'
import config from 'app/config'
import language from 'app/language'
import db from 'app/db'
import fs from 'fs'

function getPictureByName (pictureName) {
  return db.get('pictures')
    .find({ name: pictureName })
    .value()
}

function createFile (pictureName, url) {
  return FilesDownloader.download(url, config('picturesFilesPath'), pictureName)
}

function removeFile (fileName) {
  return new Promise((resolve, reject) => {
    const path = config('picturesFilesPath') + fileName

    fs.unlink(path, error => {
      if (error) {
        reject(new Error(language('remove_picture_file_error')))
      }

      resolve()
    })
  })
}

function create (pictureName, url) {
  return new Promise((resolve, reject) => {
    const picture = getPictureByName(pictureName)

    if (picture === undefined) {
      createFile(pictureName, url)
        .then(file => {
          const picture = { name: pictureName, filename: file.name }

          db.get('pictures')
            .push(picture)
            .write()

          resolve(picture)
        })
        .catch(reject)
    } else {
      reject(new Error(`${language('new_picture_not_created_error')} - ${language('picture_with_the_given_name_exists')}`))
    }
  })
}

function remove (pictureName) {
  return new Promise((resolve, reject) => {
    const picture = getPictureByName(pictureName)
    if (picture === undefined) {
      reject(new Error(language('picture_not_registered_in_config')))
    } else {
      removeFile(picture.filename)
        .then(() => {
          const removed = db.get('pictures')
            .remove({ name: pictureName })
            .write()

          if (removed.length > 0) {
            resolve()
          } else {
            reject(new Error(language('picture_not_registered_in_config')))
          }
        })
        .catch(reject)
    }
  })
}

export default { create, remove }
