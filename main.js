require('app-module-path/register');

const Discord = require('discord.js');

const CommandParser = require('app/utils/CommandParser');
const actionsHandler = require('app/utils/ActionsHandler');

const config = require('config/config.json');
const language = require('app/language');

const memesStorage = require('app/utils/MemesStorage');
try {
	 memesStorage.pull();
} catch (error) {
	throw new Error(language['memes_register_load_error']);
}

actionsHandler
	.addAction(require('app/actions/list'))
	.addAction(require('app/actions/show'))
	.addAction(require('app/actions/generate'))
	.addAction(require('app/actions/new-meme'))
;

const bot = new Discord.Client();

bot.on('ready', () => {
	console.log(language["connected_info"]);
});

bot.on('message', message => {
	const parsedMessage = CommandParser.parse(message, '!');
	actionsHandler.handle(parsedMessage);
});

bot.login(config.token);
