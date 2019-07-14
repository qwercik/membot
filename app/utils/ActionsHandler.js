const language = require('app/language');

module.exports = class ActionsHandler {
	constructor() {
		this.actions = [];
	}

	addAction(action) {
		this.actions.push(action);
		return this;
	}

	handle(parsed) {
		const channel = parsed.message.channel;

		if (!parsed.isCommand) {
			return;
		}

		const action = this.actions.find(el =>
			el.command === parsed.command && el.action === parsed.action
		);
		
		if (!action) {
			channel.send(language["unknown_command_error"]);
			return;
		}
		
		for (let index = 0; index < action.arguments.length; ++index) {
			const pattern = action.arguments[index].pattern;
			const value = parsed.arguments[index] ? parsed.arguments[index] : '';

			if (!pattern.test(value)) {
				channel.send(language["incorrect_usage_error"]);
				return;
			}
		}

		action.callback(parsed);
	}
}

