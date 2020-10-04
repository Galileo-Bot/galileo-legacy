const Event = require('../entities/Event.js');
const Logger = require('../utils/Logger.js');
const StatsCommand = require('../commands/informations/stats.js');
const {parseDate} = require('../utils/FormatUtils.js');
const {randomActivities} = require('../constants.js');
const {random} = require('../utils/Utils.js');
const {readJSON, writeInJSON} = require('../utils/Utils.js');

module.exports = class ReadyEvent extends Event {
	constructor() {
		super({
			name: 'ready',
			once: true,
		});
	}

	logInfosOfBot() {
		StatsCommand.getCPUUsage()
			.then(result => {
				Logger.warn(`RAM utilisée : ${StatsCommand.getProcessMemoryUsage()} MB`, 'ReadyEvent');
				Logger.warn(`Utilisation du processeur : ${result.percentage} %`, 'ReadyEvent');
			})
			.catch();
	}

	setRandomPresence() {
		this.client.user.setPresence({
			activity: {
				name: random(randomActivities),
				type: 'STREAMING',
				url: 'https://www.twitch.tv/Terracid',
			},
			status: 'dnd',
		});
	}

	async run(client) {
		await super.run(client);
		// Status
		this.setRandomPresence();
		setInterval(() => this.setRandomPresence(), 10 * 1000);

		// REBOOT
		const config = readJSON('./assets/jsons/config.json');
		if (config.statut === 'reboot') {
			if (client.channels.cache.has(config.cacheChannel)) {
				client.channels.cache.get(config.cacheChannel).send('Relancement du bot fini.');
			} else if (client.users.cache.has(config.cacheChannel)) {
				client.users.cache.get(config.cacheChannel).send('Relancement du bot fini.');
			}

			config.statut = 'started';
			config.cacheChannel = 'Aucun';
		}

		if (config.statut === 'maintenance') {
			await client.user.setPresence({
				status: 'dnd',
				activity: {
					name: '⚠️ En Maintenance.',
					type: 'WATCHING',
				},
			});
		}

		config.dateUpdate = parseDate('dd/MM/yyyy');
		writeInJSON('./assets/jsons/config.json', config);

		// Logging
		Logger.info(`${client.user.username} (${client.user.id}) Est allumé ! Nombre de serveurs : ${client.guilds.cache.size}.`, 'ReadyEvent');

		this.logInfosOfBot();
		this.updateCommandsStats();

		setInterval(() => {
			this.logInfosOfBot();
			this.updateCommandsStats();
		}, 20 * 60 * 1000);
	}

	/**
	 * Met à jour le JSON contenant les utilisations de commandes.
	 * @returns {void}
	 */
	updateCommandsStats() {
		const formattedDate = parseDate('dd/MM/yyyy');
		const messages = readJSON('./assets/jsons/messages.json');

		if (messages.today.length === 0) messages.today = formattedDate;
		if (messages.today !== formattedDate) {
			messages.today = formattedDate;
			messages.stats.shift();
			messages.stats.push(0);
		}

		writeInJSON('./assets/jsons/messages.json', messages);
	}
};
