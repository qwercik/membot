const memes = require('config/memes.json');

module.exports = {
	prefix: '!',
	command: 'membot',
	action: 'list',
	description: 'Print all memes\' names',
	arguments: [],
	callback: function(parsed) {
		const memesList = memes.memes.map(el => el.name).join(', ');
		parsed.message.channel.send(`Memes list: ${memesList}`);
	}
};

