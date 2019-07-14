const memes = require('config/memes.json');

module.exports = {
	prefix: '!',
	command: 'membot',
	action: 'show',
	description: 'Show the specific meme',
	arguments: [
		{name: 'memeName', pattern: /^(?!\s*$).+/},
	],
	callback: function(parsed) {
		const channel = parsed.message.channel;

		const [memeName] = parsed.arguments;
		const meme = memes.memes.find(el => el.name === memeName);

		if (!meme) {
			channel.send('Such meme doesn\'t exist! Check memes\'s list.');
			return;
		}

		channel.send({
			files: [{
				attachment: `assets/${meme.path}`,
				name: meme.path,
			}],
		}).catch(err => {
			channel.send('Meme loading error. Notify the bot\'s owner about it');
		});
	}
};

