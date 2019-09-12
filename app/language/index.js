import JsonLoader from 'app/JsonLoader'

const jsonLoader = new JsonLoader({
  fileNotExist: 'Such language doesn\'t exist',
  syntaxError: 'Syntax error in language file',
  fileNotLoaded: 'Language file has\'t been loaded yet',
  propertyNotExist: 'Translation {key} not exist. Check your language file'
})

function language (key) {
  return jsonLoader.getProperty(key)
}

function loadFromFile (path) {
  jsonLoader.loadFromFile(path)
}

language.loadFromFile = loadFromFile
export default language
