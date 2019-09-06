import fs from 'fs'
import ApplicationError from 'app/exceptions/ApplicationError'

let json

function loadFromFile (path) {
  let content
  try {
    content = fs.readFileSync(path)
  } catch (error) {
    throw new ApplicationError('Such language doesn\'t exist')
  }

  try {
    json = JSON.parse(content)
  } catch (error) {
    throw new ApplicationError('Syntax error in language file')
  }
}

function language (key) {
  if (json === undefined) {
    throw new ApplicationError('Language file not loaded yet')
  }

  const translation = json[key]

  if (translation === undefined) {
    throw new ApplicationError(`Translation '${key}' not exist. Check ${path} language file.`)
  }

  return translation
}

language.loadFromFile = loadFromFile
export default language
