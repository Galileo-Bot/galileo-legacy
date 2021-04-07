const Event = require('../entities/Event.js');
const Logger = require('../utils/Logger.js');
const StatsCommand = require('../commands/informations/stats.js');
const dayjs = require('dayjs');
const {RANDOM_ACTIVITIES} = require('../constants.js');
const {random} = require('../utils/Utils.js');

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

	resetCache() {
		this.client.dbManager.cache.ensure('images', {});
		Object.keys(this.client.dbManager.cache.get('images')).forEach(type => this.client.dbManager.cache.set('images', {}, type));
	}

	async run(client) {
		await super.run(client);

		this.setRandomPresence();
		setInterval(() => this.setRandomPresence(), 10 * 1000);

		client.dbManager.cache.ensure('status', 'starting');
		client.dbManager.cache.ensure('rebootingChannel', '');

		switch (client.dbManager.cache.get('status')) {
			case 'reboot':
				const rebootingChannel = client.dbManager.cache.get('rebootingChannel');
				if (client.channels.cache.has(rebootingChannel)) {
					await client.channels.cache.get(rebootingChannel).send('Relancement du bot fini.');
				} else {
					if (client.users.cache.has(rebootingChannel)) await client.users.cache.get(rebootingChannel).send('Relancement du bot fini.');
				}

				client.dbManager.cache.set('status', 'started');
				client.dbManager.cache.set('rebootingChannel', '');
				break;

			case 'maintenance':
				await client.user.setPresence({
					activity: {
						name: '⚠️ En Maintenance.',
						type: 'WATCHING',
					},
					status: 'dnd',
				});
				break;
		}

		Logger.info(`${client.user.username} (${client.user.id}) Est allumé ! Nombre de serveurs : ${client.guilds.cache.size}.`, 'ReadyEvent');

		this.logInfosOfBot();
		this.updateCommandsStats();
		this.resetCache();

		setInterval(() => {
			this.logInfosOfBot();
			this.updateCommandsStats();
			this.resetCache();
		}, 20 * 60 * 1000);

		setInterval(() => {
			if (client.dbManager.ready)
				client.dbManager.userInfos.forEach((guild, guildID) => {
					for (const userID in guild) {
						if (guild.hasOwnProperty(userID)) {
							const user = guild[userID];
							user.sanctions?.forEach(sanction => {
								if (sanction.time && sanction.date + sanction.time < Date.now()) {
									user.sanctions = user.sanctions.filter(s => s !== sanction);
									client.dbManager.userInfos.set(guildID, user, userID);
									Logger.log(`Removed sanction '#${sanction.case}' ('${sanction.type}') from '${userID}'.`);
								}
							});
						}
					}
				});
		}, 5 * 1000);
	}

	/**
	 * Met une présence  au botaléatoire parmis celles dans le fichier JSON.
	 * @returns {void}
	 */
	setRandomPresence() {
		this.client.user.setPresence({
			activity: {
				name: random(RANDOM_ACTIVITIES),
				type: 'STREAMING',
				url: 'https://www.twitch.tv/Terracid',
			},
			status: 'dnd',
		});
	}

	/**
	 * Met à jour le JSON contenant les utilisations de commandes.
	 * @returns {void}
	 */
	updateCommandsStats() {
		const formattedDate = dayjs().format('DD/MM/YYYY');

		if (!this.client.dbManager.messages.has('today') || this.client.dbManager.messages.get('today').length === 0) this.client.dbManager.messages.set('today');
		if (!this.client.dbManager.messages.has('stats')) this.client.dbManager.messages.set('stats', new Array(30).fill(0));
		if (this.client.dbManager.messages.get('today') !== formattedDate) {
			this.client.dbManager.messages.set('today', formattedDate);
			const stats = this.client.dbManager.messages.get('stats');
			stats.shift();
			this.client.dbManager.messages.set('stats', stats);
			this.client.dbManager.messages.push('stats', 0);
		}
	}
};
