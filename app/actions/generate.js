import MemeGenerator from 'app/utils/MemeGenerator';
import memesStorage from 'app/utils/MemesStorage';
import language from 'app/language';

export default {
	command: ['membot', 'm'],
	action: ['generate', 'g'],
	description: language["action_generate_description"],
	arguments: [
		{name: 'memeName', pattern: /^(?!\s*$).+/},
		{name: 'topText', pattern: /^.*$/},
		{name: 'bottomText', pattern: /^.*$/},
	],
	callback: async function(parsed) {
		const channel = parsed.message.channel;

		const {memeName, topText, bottomText} = parsed.arguments;

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

