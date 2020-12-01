const DBManager = require('./DBManager.js');
const {Client} = require('discord.js');
const CommandManager = require('./CommandManager.js');
const EventManager = require('./EventManager.js');

module.exports = class GaliClient extends Client {
	commandManager;
	commands;
	dbManager;
	eventManager;
	events;

	constructor() {
		super({
			messageCacheLifetime: 60 * 20,
			messageSweepInterval: 60 * 5, // ! todo This will be reactived once we reach 100 guilds :
			/*
			 ws: isCanary
			 ? {}
			 : {
			 intents: [
			 Intents.FLAGS.DIRECT_MESSAGES,
			 Intents.FLAGS.GUILDS,
			 Intents.FLAGS.GUILD_MESSAGES,
			 Intents.FLAGS.GUILD_PRESENCES,
			 Intents.FLAGS.GUILD_MEMBERS,
			 Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			 ],
			 },*/
		});

		this.dbManager = new DBManager();
		this.eventManager = new EventManager(this);
		this.commandManager = new CommandManager();
		this.commands = CommandManager.commands;
		this.events = EventManager.events;

		this.dbManager.prepare();
	}
};
