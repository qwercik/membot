import path from 'node:path'
import fs from 'node:fs'
import FilesDownloader from '#app/network/FilesDownloader.js'
import ActionError from '#app/exceptions/ActionError.js'
import config from '#app/config.js'
import language from '#app/language/index.js'
import db from '#app/db.js'

const unlink = fs.promises.unlink

function getPictureByName (pictureName) {
  return db.data.pictures.find(picture => picture.name === pictureName)
}

function createFile (pictureName, url) {
  return FilesDownloader.download(url, config('picturesFilesPath'), pictureName)
}

async function removeFile (fileName) {
  const filePath = path.join(config('picturesFilesPath'), fileName)

  try {
    await unlink(filePath)
  } catch (error) {
    throw new ActionError(language('remove_picture_file_error'))
  }
}

async function create (pictureName, url) {
  let picture = getPictureByName(pictureName)
  if (picture !== undefined) {
    throw new ActionError(`${language('new_picture_not_created_error')} - ${language('picture_with_the_given_name_exists')}`)
  }

  const file = await createFile(pictureName, url)
  picture = { name: pictureName, filename: file.name }

  try {
    db.data.pictures.push(picture)
    db.write()
  } catch (error) {
    throw new ActionError(language('db_write_error'))
  }

  return picture
}

async function remove (pictureName) {
  const picture = getPictureByName(pictureName)
  if (picture === undefined) {
    throw new ActionError(language('picture_not_registered_in_config'))
  }

  await removeFile(picture.filename)

  try {
    db.data.pictures = db.data.pictures.filter(candidate => candidate.name !== pictureName)
    db.write()
  } catch (error) {
    throw new ActionError(language('db_write_error'))
  }
}

export default { create, remove }
