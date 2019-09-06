import Bot from 'app/Bot'
const bot = new Bot()

try {
  bot.run()
} catch (error) {
  console.error(error.message)
}
