import Discord from 'discord.js'
import ActionsLoader from 'app/plugin-system/ActionsLoader'
import ActionsHandler from 'app/plugin-system/ActionsHandler'
import CommandParser from 'app/plugin-system/CommandParser'
import Command from 'app/plugin-system/Command'
import language from 'app/language'
import config from 'app/config'

export default class Bot {
  async setUpActionsHandler () {
    const actionsLoader = new ActionsLoader('app/actions')
    this.actionsHandler = new ActionsHandler(new Command(
      config('commandName'),
      config('commandAliases')
    ))

    await actionsLoader.loadActionsModules(this.actionsHandler)
  }

  setUpDiscordClient () {
    this.discordClient = new Discord.Client()

    this.discordClient.on('ready', () => {
      console.log(language('connected_info'))
    })

    this.discordClient.on('message', async rawMessage => {
      const message = CommandParser.parse(rawMessage, config('commandPrefix'))
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
