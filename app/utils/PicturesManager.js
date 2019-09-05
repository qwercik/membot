import FilesDownloader from 'app/network/FilesDownloader'
import config from 'app/config'
import language from 'app/language'
import db from 'app/db'
import fs from 'fs'
import util from 'util'

const unlink = util.promisify(fs.unlink)

function getPictureByName (pictureName) {
  return db.get('pictures')
    .find({ name: pictureName })
    .value()
}

function createFile (pictureName, url) {
  return FilesDownloader.download(url, config('picturesFilesPath'), pictureName)
}

async function removeFile (fileName) {
  const path = config('picturesFilesPath') + fileName

  try {
    await unlink(path)
  } catch (error) {
    throw new Error(language('remove_picture_file_error'))
  }
}

async function create (pictureName, url) {
  let picture = getPictureByName(pictureName)
  if (picture !== undefined) {
    throw new Error(`${language('new_picture_not_created_error')} - ${language('picture_with_the_given_name_exists')}`)
  }

  const file = await createFile(pictureName, url)
  picture = { name: pictureName, filename: file.name }

  try {
    db.get('pictures')
      .push(picture)
      .write()
  } catch (error) {
    throw new Error(language('db_write_error'))
  }

  return picture
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
