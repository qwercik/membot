import { Client, Events, GatewayIntentBits } from 'discord.js'
import ActionsLoader from '#app/plugin-system/ActionsLoader.js'
import ActionsHandler from '#app/plugin-system/ActionsHandler.js'
import Message from '#app/plugin-system/Message.js'
import Command from '#app/plugin-system/Command.js'
import language from '#app/language/index.js'
import config from '#app/config.js'

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
    this.discordClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
      ]
    })

    this.discordClient.once(Events.ClientReady, () => {
      console.log(language('connected_info'))
    })

    this.discordClient.on(Events.MessageCreate, async rawMessage => {
      const message = new Message(rawMessage, config('commandPrefix'))
      const channel = rawMessage.channel

      try {
        await this.actionsHandler.handle(message)
      } catch (error) {
        if (error.name === 'ActionError') {
          await channel.send(error.message)
        } else {
          console.error(error)
        }
      }
    })
  }

  async run () {
    await this.setUpActionsHandler()
    this.setUpDiscordClient()
    await this.discordClient.login(config('token'))
  }
}
