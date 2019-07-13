const Discord = require('discord.js');
const CommandParser = require('./CommandParser.js');
const ActionsHandler = require('./ActionsHandler.js');
const { createCanvas, loadImage } = require('canvas');

const auth = require('./auth.json');
const memes = require('./memes.json');

const actionsHandler = new ActionsHandler();
actionsHandler
	.addAction(require('./actions/list.js'))
	.addAction(require('./actions/show.js'))
	.addAction(require('./actions/generate.js'));

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
