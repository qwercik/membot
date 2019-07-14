require('app-module-path/register');

const Discord = require('discord.js');

const CommandParser = require('app/utils/CommandParser');
const ActionsHandler = require('app/utils/ActionsHandler');

const auth = require('config/auth.json');
const language = require('app/language');

const actionsHandler = new ActionsHandler();
actionsHandler
	.addAction(require('app/actions/list'))
	.addAction(require('app/actions/show'))
	.addAction(require('app/actions/generate'));

const bot = new Discord.Client();

bot.on('ready', () => {
	console.log(language["connected_info"]);
});

bot.on('message', message => {
	const parsedMessage = CommandParser.parse(message, '!');
	actionsHandler.handle(parsedMessage);
});

bot.login(auth.token);
