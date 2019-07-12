const Discord = require('discord.js');
const auth = require('./auth.json');

const bot = new Discord.Client();

bot.on('ready', () => {
	console.log('Connected');
});

bot.on('message', msg => {
	if (msg.content === '!zyczenia') {
		msg.channel.send({
			files: [{
				attachment: 'assets/zyczenia.jpg',
				name: 'zyczenia.jpg',
			}],
		});
	}
});

bot.login(auth.token);
