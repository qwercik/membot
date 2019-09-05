import config from 'config/config'
import language from 'app/language'

export default function getConfig (key) {
  const setting = config[key]

  if (setting === undefined) {
    throw new Error(language('config_setting_error'))
  }

  return setting
}
