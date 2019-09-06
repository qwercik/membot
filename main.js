import Bot from 'app/Bot'
import language from 'app/language'
import config from 'app/config'
const bot = new Bot()

try {
  config.loadFromFile('config/config.json')
  language.loadFromFile(`app/language/${config('language')}.json`)

  bot.run()
} catch (error) {
  if (error.name === 'ApplicationError') {
    console.error(error.message)
  } else {
    console.error(language('unknown_error'))
  }
}
