const Discord = require('discord.js');
const auth = require('./auth.json');

const bot = new Discord.Client();

bot.on('ready', () => {
	console.log('Connected');
});

bot.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('Pong');
	}
});

bot.login(auth.token);
