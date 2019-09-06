import config from 'config/config'
import fs from 'fs'
import LanguageError from 'app/exceptions/LanguageError'

const path = `app/language/${config['language']}.json`

let json
try {
  json = JSON.parse(fs.readFileSync(path))
} catch (error) {
  throw new LanguageError('Such language doesn\'t exist!')
}

export default function language (key) {
  const translation = json[key]

  if (translation === undefined) {
    throw new LanguageError(`Translation '${key}' not exist. Check ${path} language file.`)
  }

  return translation
}
