const request = require('request');
const fs = require('fs');

const memesStorage = require('app/utils/MemesStorage');
const language = require('app/language');

module.exports = {
	prefix: '!',
	command: 'membot',
	action: 'new-meme',
	description: language["action_new-meme_description"],
	arguments: [
		{name: 'memeName', pattern: /^(?!\s*$).+/},
		{name: 'memeUrl', pattern: /https?:\/\/(www\.)?[-a-za-z0-9@:%._\+~#=]{1,256}\.[a-za-z0-9()]{1,6}\b([-a-za-z0-9()@:%_\+.~#?&//=]*)/},
	],
	callback: async function(parsed) {
		const channel = parsed.message.channel;

		const [memeName, memeUrl] = parsed.arguments;

		request.get({
			url: memeUrl,
		})
		.on('response', async response => {
			const memePath = 'custom/' + memeName + '.' + response.headers['content-type'].split('/')[1];
			response.pipe(fs.createWriteStream('assets/' + memePath));

			try {
				await memesStorage.set({
					name: memeName,
					path: memePath,
				});
			} catch (error) {
				channel.send(language['new_meme_not_created_error']);
			}

			channel.send(language['new_meme_created']);
		})
		.on('error', error => {
			channel.send(error);
			return;
		});
	}
};

