import Discord from 'discord.js'
import ActionsHandler from 'app/mediator/ActionsHandler'
import CommandParser from 'app/mediator/CommandParser'
import language from 'app/language'
import config from 'app/config'

import ListAction from 'app/actions/list'
import ShowAction from 'app/actions/show'
import GenerateAction from 'app/actions/generate'
import NewPictureAction from 'app/actions/new-picture'
import RemovePictureAction from 'app/actions/remove-picture'

export default class Bot {
  constructor () {
    this.setUpActionsHandler()
    this.setUpDiscordClient()
  }

  setUpActionsHandler () {
    this.actionsHandler = new ActionsHandler(config('commands'))
    this.actionsHandler
      .addAction(ListAction)
      .addAction(ShowAction)
      .addAction(GenerateAction)
      .addAction(NewPictureAction)
      .addAction(RemovePictureAction)
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

  run () {
    this.discordClient.login(config('token'))
  }
}
