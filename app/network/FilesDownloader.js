import path from 'node:path'
import fs from 'node:fs'
import { pipeline } from 'node:stream/promises'
import axios from 'axios'
import language from '#app/language/index.js'
import ActionError from '#app/exceptions/ActionError.js'

function getDownloadedFileType (response) {
  const contentType = response.headers['content-type']

  if (contentType) {
    return contentType.split('/')[1].split(';')[0].trim().toLowerCase()
  }

  return response.config.url.split('.').pop().toLowerCase()
}

async function download (url, saveDirectory, nameWithoutExtension) {
  let response
  try {
    response = await axios({
      url,
      method: 'get',
      responseType: 'stream'
    })
  } catch (error) {
    if (error.response === undefined) {
      throw new ActionError(language('request_error'))
    }

    throw new ActionError(language('resource_not_exist_error'))
  }

  const supportedFileTypes = ['jpg', 'jpeg', 'png', 'gif']
  const fileType = getDownloadedFileType(response)
  if (!supportedFileTypes.includes(fileType)) {
    response.data.destroy()
    throw new ActionError(language('unsupported_filetype_error'))
  }

  const fileName = `${nameWithoutExtension}.${fileType}`
  const filePath = path.join(saveDirectory, fileName)

  try {
    await pipeline(response.data, fs.createWriteStream(filePath))
  } catch (error) {
    throw new ActionError(language('no_permissions_to_save_downloaded_file'))
  }

  return {
    name: fileName,
    path: filePath,
    type: fileType
  }
}

export default { download }
