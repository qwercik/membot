const { createCanvas, loadImage } = require('canvas');
const memes = require('config/memes.json');
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


		const meme = memes.memes.find(el => el.name === memeName);
		if (!meme) {
			channel.send(language["meme_not_registered_in_config"]);
			return;
		}
		
		const image = await loadImage(meme.path).catch(() => {
			channel.send(language["meme_file_loading_error"]);
			return;
		});

		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');

		ctx.drawImage(image, 0, 0);
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;

		const fontSize = image.height * 0.15;
		ctx.font = `bold ${fontSize}px Impact`;

		const topTextMargin = ctx.measureText(topText.toUpperCase()).width > 0.9 * image.width ? 0.05 * image.width : (image.width - ctx.measureText(topText.toUpperCase()).width) / 2;
		ctx.fillText(topText.toUpperCase(), topTextMargin, image.height * 0.20, 0.9 * image.width);
		ctx.strokeText(topText.toUpperCase(), topTextMargin, image.height * 0.20, 0.9 * image.width);

		const bottomTextMargin = ctx.measureText(bottomText.toUpperCase()).width > 0.9 * image.width ? 0.05 * image.width : (image.width - ctx.measureText(bottomText.toUpperCase()).width) / 2;
		ctx.fillText(bottomText.toUpperCase(), bottomTextMargin, image.height * 0.95, 0.9 * image.width);
		ctx.strokeText(bottomText.toUpperCase(), bottomTextMargin, image.height * 0.95, 0.9 * image.width);

		channel.send({
			files: [{
				attachment: canvas.createJPEGStream(),
			}],
		}).catch(err => {
			channel.send(language["meme_file_loading_error"]);
		});
	}
};

