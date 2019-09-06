import config from 'config/config'
import language from 'app/language'
import ConfigError from 'app/exceptions/ConfigError'

export default function getConfig (key) {
  const setting = config[key]

  if (setting === undefined) {
    throw new ConfigError(language('config_setting_error'))
  }

  return setting
}
