import db from 'app/db'
import language from 'app/language'

export default {
  name: 'help',
  aliases: ['h'],
  description: language('action_help_description'),
  arguments: [
    { name: 'actionName', pattern: /^.*$/ }
  ],
  callback: async function (parsed, handler) {
    const channel = parsed.message.channel
    const { actionName } = parsed.arguments

    if (actionName === '') {
      const message = 'Lista akcji: ' + handler.actions.map(action => action.name).join(', ') + '\n'
        + 'Wpisz !help <nazwa akcji> aby dowiedzieć się czegoś więcej o którejś z akcji'

      channel.send(message)
    } else {
      channel.send(handler.actions.find(action => action.aliases.concat([action.name]).includes(actionName)).description)
    }
  }
}
