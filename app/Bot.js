const Discord = require('discord.js');
const ActionsHandler = require('app/utils/ActionsHandler');
const memesStorage = require('app/utils/MemesStorage');
const CommandParser = require('app/utils/CommandParser');
const language = require('app/language');
const config = require('config/config.json');

module.exports = class Bot {
	constructor() {
		this.setUpMemesStorage();
		this.setUpActionsHandler();
		this.setUpDiscordClient();
	}
	
	async setUpMemesStorage() {
		await memesStorage.pull()
			.catch(() => {
				new Error('Coś się popsuło');
			});
	}

	setUpActionsHandler() {
		this.actionsHandler = new ActionsHandler();

		this.actionsHandler
			.addAction(require('app/actions/list'))
			.addAction(require('app/actions/show'))
			.addAction(require('app/actions/generate'))
			.addAction(require('app/actions/new-meme'))
		;
	}
	
	setUpDiscordClient() {
		this.discordClient = new Discord.Client();

		this.discordClient.on('ready', () => {
			console.log(language['connected_info']);
		});
		
		this.discordClient.on('message', message => {
			const parsedMessage = CommandParser.parse(message, '!');
			this.actionsHandler.handle(parsedMessage);
		});
	}

	run() {
		this.discordClient.login(config.token);
	}
}
