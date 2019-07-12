/* Action structure
 *
 * {
 * 		"prefix": "sth",
 * 		"command": "sth",
 * 		"action": "sth",
 * 		"description": "sth",
 * 		"arguments: [
 *			{"name": "sth", "pattern": "//"},
 *			{"name": "sth", "pattern": "//"},
 * 		],
 *		"callback": func,
 * }
 **/

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
			channel.send('Unknown command');
			return;
		}
		
		for (let index = 0; index < action.arguments.length; ++index) {
			const pattern = action.arguments[index].pattern;
			const value = parsed.arguments[index] ? parsed.arguments[index] : '';

			if (!pattern.test(value)) {
				channel.send('Incorrect usage');
				return;
			}
		}

		action.callback(parsed);
	}
}

