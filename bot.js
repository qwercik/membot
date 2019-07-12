const discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
	colorize: true,
});
logger.level = 'debug';


const bot = new discord.Client({
	token: auth.token,
	autorun: true,
});

bot.on('ready', function() {
	logger.info('Connected');
});

bot.on('message', function (user, userId, channelId, message, event) {
	if (message === 'siema') {
		bot.sendMessage({
			to: channelId,
			message: 'nara',
		});
	}
});

