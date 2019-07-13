const Discord = require('discord.js');
const CommandParser = require('./CommandParser.js');
const ActionsHandler = require('./ActionsHandler.js');
const { createCanvas, loadImage } = require('canvas');

const auth = require('./auth.json');
const memes = require('./memes.json');

const actionsHandler = new ActionsHandler();
actionsHandler
	.addAction({
		prefix: '!',
		command: 'membot',
		action: 'list',
		description: 'Print all memes\' names',
		arguments: [],
		callback: function(parsed) {
			const memesList = memes.memes.map(el => el.name).join(', ');
			parsed.message.channel.send(`Memes list: ${memesList}`);
		}
	})
	.addAction({
		prefix: '!',
		command: 'membot',
		action: 'show',
		description: 'Show the specific meme',
		arguments: [
			{name: 'memeName', pattern: /^(?!\s*$).+/},
		],
		callback: function(parsed) {
			const channel = parsed.message.channel;

			const memeName = parsed.arguments[0];
			const meme = memes.memes.find(el => el.name === memeName);

			if (!meme) {
				channel.send('Such meme doesn\'t exist! Check memes\'s list.');
				return;
			}

			channel.send({
				files: [{
					attachment: meme.path,
					name: meme.path,
				}],
			}).catch(err => {
				channel.send('Meme loading error. Notify the bot\'s owner about it');
			});
		}
	})
	.addAction({
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
	});

const bot = new Discord.Client();

bot.on('ready', () => {
	console.log('Connected');
});

bot.on('message', message => {
	const channel = message.channel;
	const parsedMessage = CommandParser.parse(message, '!');
	actionsHandler.handle(parsedMessage);
});

bot.login(auth.token);
