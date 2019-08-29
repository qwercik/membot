import fs from 'fs'
import request from 'request'
import language from 'app/language'

function getDownloadedFileType (response) {
  const contentType = response.headers['content-type']

  if (contentType) {
    return contentType.split('/')[1]
  } else {
    return response.requestUrl.split('.').pop().toLowerCase()
  }
}

function forceEndingWith (string, forced) {
  if (!string.endsWith(forced)) {
    string += forced
  }

  return string
}

function makeSureFileTypeSupported (response) {
  const supportedFileTypes = ['jpg', 'jpeg', 'png', 'gif']
  const fileType = getDownloadedFileType(response)

  if (!supportedFileTypes.includes(fileType)) {
    throw new Error(language['unsupported_filetype_error'])
  }

  return fileType
}

function download (url, saveDirectory, nameWithoutExtension) {
  return new Promise((resolve, reject) => {
    request.get(url)
      .on('error', () => {
        reject(language['request_error'])
      })
      .on('response', response => {
        response.requestUrl = url
        if (response.statusCode !== 200) {
          reject(language['resource_not_exist_error'])
        }

        const fileType = makeSureFileTypeSupported(response)
        const fileName = nameWithoutExtension + '.' + fileType
        const filePath = forceEndingWith(saveDirectory, '/') + fileName

        try {
          response.pipe(fs.createWriteStream(filePath))
        } catch (error) {
          reject(language['no_permissions_to_save_downloaded_file'])
        }

        resolve(fileName)
      })
  })
}

export default { download }
