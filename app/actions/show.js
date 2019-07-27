const memesStorage = require('app/utils/MemesStorage');
const language = require('app/language');

module.exports = {
	prefix: '!',
	command: 'membot',
	action: 'show',
	description: language["action_show_description"],
	arguments: [
		{name: 'memeName', pattern: /^(?!\s*$).+/},
	],
	callback: async function(parsed) {
		const channel = parsed.message.channel;

		const [memeName] = parsed.arguments;
		const meme = memesStorage.register.find(el => el.name === memeName);

		if (!meme) {
			channel.send(language['meme_not_registered_in_config']);
			return;
		}

		channel.send({
			files: [{
				attachment: `assets/${meme.path}`,
				name: meme.path,
			}],
		}).catch(err => {
			channel.send(language['meme_file_loading_error']);
		});
	}
};

