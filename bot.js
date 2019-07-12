const Discord = require('discord.js');
const auth = require('./auth.json');
const memes = require('./memes.json');

class Command {
	constructor(message) {
		this.name = "";
		this.action = "";
		this.arguments = [];

		this.parseMessage(message);	
	}

	parseMessage(message) {
		const parts = message.split(' ');
		
		if (parts.length >= 1) {
			this.name = parts[0];
		}

		if (parts.length >= 2) {
			this.action = parts[1];
		}

		for (let i = 2; i < parts.length; ++i) {
			this.arguments.push(parts[i]);
		}
	}
}


const bot = new Discord.Client();

bot.on('ready', () => {
	console.log('Connected');
});

bot.on('message', msg => {
	const channel = msg.channel;
	const command = new Command(msg.content);

	if (command.name === '!membot') {
		switch (command.action) {
			case 'list':
				const memesList = memes.memes.map(el => el.name).join(', ');
				channel.send(`Memes list: ${memesList}`);
				break;

			case 'show':
				if (command.arguments.length != 1) {
					msg.reply('Incorrect usage! See !membot help.');
					break;
				}

				const memeName = command.arguments[0];
				const meme = memes.memes.find(el => el.name === memeName);
				
				if (!meme) {
					msg.reply('Such meme doesn\'t exist! Check memes\'s list here: !membot list');
					break;
				}

				channel.send({
					files: [{
						attachment: meme.path,
						name: meme.path,
					}],
				}).catch(err => {
					msg.reply('Meme loading error. Notify the bot\'s owner about it.');
				});

				break;

			default:
				msg.reply('Incorrect action. Check !membot help');
		}
	}
});

bot.login(auth.token);
