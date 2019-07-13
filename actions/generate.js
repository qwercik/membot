const memes = require('./../memes.json');

module.exports = {
	prefix: '!',
	command: 'membot',
	action: 'generate',
	description: 'Generate your own meme',
	arguments: [
		{name: 'memeName', pattern: /^(?!\s*$).+/},
		{name: 'topText', pattern: /^(?!\s*$).+/},
		{name: 'bottomText', pattern: /^(?!\s*$).+/},
	],
	callback: async function(parsed) {
		const channel = parsed.message.channel;
		const [memeName, topText, bottomText] = parsed.arguments;
		
		const meme = memes.memes.find(el => el.name === memeName);
		if (!meme) {
			channel.send('Such meme doesn\'t exist! Check memes\'s list.');
			return;
		}
		
		const image = await loadImage(meme.path);
		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');

		ctx.drawImage(image, 0, 0);
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;

		ctx.font = 'bold 100% Impact';
		ctx.fillText(topText.toUpperCase(), 0.05 * image.width, 100);
		ctx.strokeText(topText.toUpperCase(), 0.05 * image.width, 100);
		ctx.fillText(bottomText.toUpperCase(), 0.05 * image.width, image.height - 100);
		ctx.strokeText(bottomText.toUpperCase(), 0.05 * image.width, image.height - 100);

		channel.send({
			files: [{
				attachment: canvas.createJPEGStream(),
			}],
		}).catch(err => {
			channel.send('Meme loading error. Notify the bot\'s owner about it');
		});
	}
};

