import Discord from 'discord.js'
import ActionsHandler from 'app/mediator/ActionsHandler'
import CommandParser from 'app/mediator/CommandParser'
import language from 'app/language'
import config from 'app/config'

export default class Bot {
  constructor () {
  }

  async setUpActionsHandler () {
    const actions = config('actions')
    this.actionsHandler = new ActionsHandler(config('commands'))

    for (const action of actions) {
      try {
        const module = (await import(`app/actions/${action}`)).default
        this.actionsHandler.addAction(module)
      } catch (error) {
        console.error(`${language('action_load_error')} ${action}`)
      }
    }
  }

  setUpDiscordClient () {
    this.discordClient = new Discord.Client()

    this.discordClient.on('ready', () => {
      console.log(language('connected_info'))
    })

    this.discordClient.on('message', message => {
      const parsedMessage = CommandParser.parse(message)
      this.actionsHandler.handle(parsedMessage)
    })
  }

  async run () {
    await this.setUpActionsHandler()
    this.setUpDiscordClient()
    this.discordClient.login(config('token'))
  }
}
