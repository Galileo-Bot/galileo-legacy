const {Client, Intents} = require('discord.js');
const CommandManager = require('./CommandManager.js');
const EventManager = require('./EventManager.js');

/**
 * @module GaliClient
 */
module.exports = class GaliClient extends Client {
	commandManager;
	eventManager;
	commands;
	events;

	constructor() {
		super({
			messageCacheLifetime: 60 * 20,
			messageSweepInterval: 60 * 5,
			ws: {
				/*intents: [
					'GUILDS', 'GUILD_BANS', 'GUILDS_MEMBER', 'GUILD_EMOJIS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'
				]*/
			},
		});

		this.eventManager = new EventManager(this);
		this.commandManager = new CommandManager();
		this.commands = CommandManager.commands;
		this.events = EventManager.events;
	}
};
