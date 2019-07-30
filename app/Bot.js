import Discord from 'discord.js';
import ActionsHandler from 'app/utils/ActionsHandler';
import memesStorage from 'app/utils/MemesStorage';
import CommandParser from 'app/utils/CommandParser';
import language from 'app/language';
import config from 'config/config.json';

import ListAction from 'app/actions/list';
import ShowAction from 'app/actions/show';
import GenerateAction from 'app/actions/generate';
import NewMemeAction from 'app/actions/new-meme';

export default class Bot {
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

	async setUpActionsHandler() {
		this.actionsHandler = new ActionsHandler();

		this.actionsHandler
			.addAction(ListAction)
			.addAction(ShowAction)
			.addAction(GenerateAction)
			.addAction(NewMemeAction)
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
