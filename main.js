import Bot from '#app/Bot.js'
import language from '#app/language/index.js'
import config from '#app/config.js'

try {
  config.loadFromFile('config/config.json')
  language.loadFromFile(`app/language/${config('language')}.json`)

  const bot = new Bot()
  await bot.run()
} catch (error) {
  if (error.name === 'ApplicationError') {
    console.error(error.message)
  } else {
    console.error(error)
  }

  process.exitCode = 1
}
