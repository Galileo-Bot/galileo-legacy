const Logger = require('../../utils/Logger.js');
const Event = require('../Event.js');
const {BetterEmbed} = require('discord.js-better-embed');

module.exports = class GuildEvent extends Event {
	/**
	 * Représente un type de GuildEvent :
	 * * **`add`** - Le bot a rejoint un serveur.
	 * * **`remove`** - Le bot a quitté un serveur.
	 * @typedef {string} GuildEventType
	 */

	guild;
	/**
	 * @type {GuildEventType}
	 */
	type;

	/**
	 * Créé un nouvel évent Guild.
	 * @param {GuildEventOptions} options - Les options.
	 */
	constructor(options) {
		super(options);
		this.type = options.type;
	}

	/**
	 * Renvoie l'Embed d'un GuildEvent.
	 * @returns {BetterEmbed} - L'embed.
	 */
	get embed() {
		if (!this.guild.available) return null;

		const embed = BetterEmbed.fromTemplate('complete', {
			client: this.client,
			color: this.type === 'remove' ? '#dd2211' : '#14dd10',
			description: `**${this.guild.name}** (\`${this.guild.id}\`)`,
			title: `Le bot a ${this.type === 'remove' ? 'quitté' : 'rejoint'} un serveur.`,
		});

		embed.setThumbnail(this.guild.iconURL());
		embed.addField('Créateur :', `${this.owner?.user ?? this.owner} (\`${this.guild.ownerID}\`)`);
		embed.addField('Nombre de membres :', `**${this.guild.memberCount}** dont **${this.guild.members.cache.filter(m => m.user.bot).size}** bots.`);

		return embed;
	}

	/**
	 * Log l'évent.
	 * @returns {void}
	 */
	async log() {
		if (!this.guild.available) return;

		Logger.info(
			`Le bot a ${this.type === 'remove' ? 'quitté' : 'rejoint'} le serveur '${this.guild.name}' (${this.guild.id}), owner : ${this.owner?.user?.tag ?? this.owner} (${this.guild.ownerID})
Nombre de serveurs actuel : ${this.client.guilds.cache.size}`,
			`Guild${this.type[0].toUpperCase() + this.type.slice(1)}Event`
		);
	}

	/**
	 * @param {GaliClient} client - Le client.
	 * @param {Guild} guild - Le serveur
	 * @returns {Promise<void>}
	 */
	async run(client, guild) {
		await super.run(client);
		this.guild = guild;
	}
};
