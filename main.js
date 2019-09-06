import Bot from 'app/Bot'
import language from 'app/language'
const bot = new Bot()

try {
  bot.run()
} catch (error) {
  if (error.name === 'ApplicationError') {
    console.error(error.message)
  } else {
    console.error(language('unknown_error'))
  }
}
