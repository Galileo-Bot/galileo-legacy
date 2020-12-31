const Command = require('../../entities/Command.js');
const {BetterEmbed} = require('discord.js-better-embed');
const {tags} = require('../../constants.js');

module.exports = class ListerStaffCommand extends Command {
	constructor() {
		super({
			name: 'listerstaff',
			description: "Permet d'avoir la liste des admins/modérateurs/bots du serveur.",
			aliases: ['ls', 'lister-staff', ' liststaff'],
			tags: [tags.guild_only],
		});
	}

	/**
	 * Renvoie la liste des admins du serveur.
	 * @param {Message} message - Le message du serveur.
	 * @returns {Collection<module:"discord.js".Snowflake, module:"discord.js".GuildMember>} - Les admins.
	 */
	static getAdmins(message) {
		return message.guild?.members.cache.filter(m => message.guild.ownerID !== m.user.id && !m.user.bot && m.permissions.has('ADMINISTRATOR'));
	}

	/**
	 * Renvoie la liste des bots du serveur.
	 * @param {Message} message - Le message du serveur.
	 * @returns {Collection<module:"discord.js".Snowflake, module:"discord.js".GuildMember>} - Les bots.
	 */
	static getBots(message) {
		return message.guild?.members.cache.filter(m => m.user.bot);
	}

	/**
	 * Renvoie la liste des modérateurs du serveur.
	 * @param {Message} message - Le message du serveur.
	 * @returns {Collection<module:"discord.js".Snowflake, module:"discord.js".GuildMember>} - Les modérateurs.
	 */
	static getMods(message) {
		return message.guild?.members.cache.filter(m => message.guild.owner !== m && !m.user.bot && (m.permissions.has('BAN_MEMBERS', false) || m.permissions.has('KICK_MEMBERS', false)));
	}

	/**
	 * Ajoute un field via la collection.
	 * @param {BetterEmbed} embed - L'embed.
	 * @param {string} text - Le titre du field.
	 * @param {Collection<module:"discord.js".Snowflake, module:"discord.js".GuildMember>} collection - La collection de membres.
	 */
	addField(embed, text, collection) {
		if (collection.size > 0)
			embed.addField(
				text,
				collection
					.array()
					.sort((a, b) => a.displayName.localeCompare(b.displayName))
					.join('\n')
			);
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const admins = ListerStaffCommand.getAdmins(message);
		const mods = ListerStaffCommand.getMods(message);
		const bots = ListerStaffCommand.getBots(message);

		const embed = BetterEmbed.fromTemplate('complete', {
			client,
			description: `<:owner:577839458393784320> **Créateur : **${message.guild.owner}`,
			title: 'Voici la liste du staff du serveur :',
		});
		embed.setColor('#0faf2f');

		this.addField(embed, '<:inventaire:635159040510656512> Administrateurs :', admins);
		this.addField(embed, '<:bug:635159047284195328> Modérateurs :', mods);
		this.addField(embed, '<:bot:638858747351007233> Bots :', bots);

		await super.send(embed);
	}
};
