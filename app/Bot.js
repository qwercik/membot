import Discord from 'discord.js'
import ActionsLoader from 'app/mediator/ActionsLoader'
import ActionsHandler from 'app/mediator/ActionsHandler'
import CommandParser from 'app/mediator/CommandParser'
import language from 'app/language'
import config from 'app/config'
import fs from 'fs'
import util from 'util'

const readdir = util.promisify(fs.readdir)

export default class Bot {
  async setUpActionsHandler () {
    this.actionsHandler = new ActionsHandler(config('commands'))
    const actionsLoader = new ActionsLoader('app/actions')

    await actionsLoader.loadActionsModules(this.actionsHandler)
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
