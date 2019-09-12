import JsonLoader from 'app/JsonLoader'
import language from 'app/language'

const jsonLoader = new JsonLoader({
  fileNotExist: 'Config load error',
  syntaxError: 'Config syntax error',
  fileNotLoaded: 'Config not loaded',
  propertyNotExist: 'Config setting error'
})

function loadFromFile (path) {
  jsonLoader.loadFromFile(path)
}

function config (key) {
  return jsonLoader.getProperty(key)
}

config.loadFromFile = loadFromFile
export default config
