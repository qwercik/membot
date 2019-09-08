import Discord from 'discord.js'
import ActionsLoader from 'app/plugin-system/ActionsLoader'
import ActionsHandler from 'app/plugin-system/ActionsHandler'
import CommandParser from 'app/plugin-system/CommandParser'
import language from 'app/language'
import config from 'app/config'
import fs from 'fs'
import util from 'util'
import ApplicationError from 'app/exceptions/ApplicationError'

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

    this.discordClient.on('message', async rawMessage => {
      const message = CommandParser.parse(rawMessage)
      const channel = message.rawMessage.channel

      try {
        await this.actionsHandler.handle(message)
      } catch (error) {
        if (error.name === 'ActionError') {
          channel.send(error.message)
        } else {
          throw error
        }
      }
    })
  }

  async run () {
    await this.setUpActionsHandler()
    this.setUpDiscordClient()
    this.discordClient.login(config('token'))
  }
}
