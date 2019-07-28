const MemeGenerator = require('app/utils/MemeGenerator');
const memesStorage = require('app/utils/MemesStorage');
const language = require('app/language');

module.exports = {
	prefix: '!',
	command: 'membot',
	action: 'generate',
	description: language["action_generate_description"],
	arguments: [
		{name: 'memeName', pattern: /^(?!\s*$).+/},
		{name: 'topText', pattern: /^.*$/},
		{name: 'bottomText', pattern: /^.*$/},
	],
	callback: async function(parsed) {
		const channel = parsed.message.channel;

		const memeName = parsed.arguments[0];
		const topText = parsed.arguments[1] ? parsed.arguments[1] : '';
		const bottomText = parsed.arguments[2] ? parsed.arguments[2] : '';


		const meme = memesStorage.register.find(el => el.name === memeName);
		if (!meme) {
			channel.send(language['meme_not_registered_in_config']);
			return;
		}
		
		const generatedMeme = await MemeGenerator.generate(meme.path, topText, bottomText)
			.catch(error => {
				channel.send(error);
			});

		channel.send({
			files: [{
				attachment: generatedMeme,
			}],
		}).catch(err => {
			channel.send(language['meme_file_loading_error']);
		});
	}
};

