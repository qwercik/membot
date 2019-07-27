const memesStorage = require('app/utils/MemesStorage');
const language = require('app/language');

module.exports = {
	prefix: '!',
	command: 'membot',
	action: 'list',
	description: language["action_list_description"],
	arguments: [],
	callback: async function(parsed) {
		const channel = parsed.message.channel;

		const memesList = memesStorage.register.map(el => el.name).join(', ');
		channel.send(`${language['memes_list_info']}: ${memesList}`);
	}
};

