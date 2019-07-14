const memes = require('config/memes.json');
const language = require('app/language');

module.exports = {
	prefix: '!',
	command: 'membot',
	action: 'list',
	description: language["action_list_description"],
	arguments: [],
	callback: function(parsed) {
		const memesList = memes.memes.map(el => el.name).join(', ');
		parsed.message.channel.send(`${language["memes_list_info"]}: ${memesList}`);
	}
};

