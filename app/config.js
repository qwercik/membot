import language from 'app/language'
import ApplicationError from 'app/exceptions/ApplicationError'
import fs from 'fs'

let json

function loadFromFile (path) {
  let content
  try {
    content = fs.readFileSync(path)
  } catch (error) {
    throw new ApplicationError(language('config_load_error'))
  }

  try {
    json = JSON.parse(content)
  } catch (error) {
    throw new ApplicationError(language('config_syntax_error'))
  }
}

function config (key) {
  if (json === undefined) {
    throw new ApplicationError(language('config_not_loaded'))
  }

  const setting = json[key]
  if (setting === undefined) {
    throw new ApplicationError(language('config_setting_error'))
  }

  return setting
}

config.loadFromFile = loadFromFile
export default config
