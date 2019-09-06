import fs from 'fs'
import axios from 'axios'
import language from 'app/language'
import { forceEndingWith } from 'app/utils'

function getDownloadedFileType (response) {
  const contentType = response.headers['content-type']

  if (contentType) {
    return contentType.split('/')[1]
  } else {
    return response.config.url.split('.').pop().toLowerCase()
  }
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
      throw new Error(language('request_error'))
    }

    throw new Error(language('resource_not_exist_error'))
  }

  const supportedFileTypes = ['jpg', 'jpeg', 'png', 'gif']
  const fileType = getDownloadedFileType(response)
  if (!supportedFileTypes.includes(fileType)) {
    throw new Error(language('unsupported_filetype_error'))
  }

  const fileName = nameWithoutExtension + '.' + fileType
  const filePath = forceEndingWith(saveDirectory, '/') + fileName

  let stream
  try {
    stream = response.data.pipe(fs.createWriteStream(filePath))
  } catch (error) {
    throw new Error(language('no_permissions_to_save_downloaded_file'))
  }

  await (() => new Promise(resolve => stream.on('finish', resolve)))()

  return {
    name: fileName,
    path: filePath,
    type: fileType
  }
}

export default { download }
