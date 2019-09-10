import Action from 'app/plugin-system/Action'
import ActionError from 'app/exceptions/ActionError'
import language from 'app/language'

export default class HelpAction extends Action {
  getName () {
    return 'help'
  }

  getAliases () {
    return ['h']
  }

  getDescription () {
    return language('action_help_description')
  }

  getArguments () {
    return [
      { name: 'actionName', pattern: /^.*$/, description: language('action_name_argument_description') }
    ]
  }

  async callback (message, handler) {
    const { channel, author } = message.rawMessage
    const { actionName } = message.arguments
    const actionsList = handler.getActions()

    let messageContent
    if (actionName === '') {
      const actionsListString = actionsList.map(action => `${action.getName()} - ${action.getDescription()}`).join('\n')

      messageContent = {
        embed: {
          color: 0x40ABF7,
          title: language('bot_help_title'),
          description: language('bot_help_description'),
          fields: [
            { name: language('section_instructions_syntax_title'), value: language('section_instructions_syntax_content') },
            { name: language('section_aliases_title'), value: language('section_aliases_content') },
            { name: language('section_examples_title'), value: language('section_examples_content') },
            { name: language('section_actions_list_title'), value: actionsListString },
            { name: language('section_learn_more_title'), value: language('section_learn_more_content') }
          ]
        }
      }
    } else {
      const action = actionsList.find(action => action.getAllReferenceNames().includes(actionName))
      if (action === undefined) {
        throw new ActionError(language('action_not_exist'))
      }

      const allReferenceNamesString = action.getAllReferenceNames().join(', ')
      const argumentsString = action.getArguments().map(argument => `${argument.name} - ${argument.description}`).join('\n') || language('no_arguments')

      messageContent = {
        embed: {
          color: 0x40ABF7,
          title: `${language('action')} ${action.getName()}`,
          description: action.getDescription(),
          fields: [
            { name: language('available_aliases'), value: `${language('available_aliases_text')}: ${allReferenceNamesString}` },
            { name: language('arguments'), value: argumentsString }
          ]
        }
      }
    }

    try {
      await author.send(messageContent)
    } catch (error) {
      throw new ActionError(`${author}, ${language('priv_unblock_request')}`)
    }

    if (!message.isPrivate()) {
      channel.send(`${author}, ${language('help_send_in_priv')}`)
    }
  }
}
