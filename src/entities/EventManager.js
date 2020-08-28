const {Collection} = require('discord.js');
const Logger = require('../utils/Logger.js');
const fs = require('fs');


module.exports = class EventManager {
	static events = new Collection();
	client;
	
	constructor(client) {
		this.client = client;
	}
	
	async loadEvents(dirName) {
		const path = `./${dirName}`;
		const eventDir = fs.readdirSync(path);
		Logger.info(`Chargement des évènements dans le dossier '${dirName}'.`, 'LoadingEvents');
		
		for (const eventFile of eventDir) {
			const event = new (require(`../${dirName}/${eventFile}`))();
			if (event) {
				this.bind(event);
			}
		}
	}
	
	bind(event) {
		EventManager.events.set(event.name, event);
		this.client.on(event.name, (...args) => event.run(this.client, ...args));
		Logger.log(`Évènement '${event.name}' chargé..`, 'EventManager');
	}
	
	unbind(event) {
		EventManager.events.delete(event.name);
		this.client.removeAllListeners(event.name);
		Logger.log(`Évènement '${event.name}' déchargé.`, 'EventManager');
	}
};
