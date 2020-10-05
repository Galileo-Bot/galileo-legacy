const {MessageEmbed} = require('discord.js');
const Command = require('../../entities/Command.js');
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
	 * @returns {Collection<module:"discord.js".Snowflake, module:"discord.js".GuildMember>}
	 */
	static getAdmins(message) {
		return message.guild?.members.cache.filter(m => message.guild.ownerID !== m.user.id && !m.user.bot && m.permissions.has('ADMINISTRATOR'));
	}

	/**
	 * Renvoie la liste des bots du serveur.
	 * @param {Message} message - Le message du serveur.
	 * @returns {Collection<module:"discord.js".Snowflake, module:"discord.js".GuildMember>}
	 */
	static getBots(message) {
		return message.guild?.members.cache.filter(m => m.user.bot);
	}

	/**
	 * Renvoie la liste des modérateurs du serveur.
	 * @param {Message} message - Le message du serveur.
	 * @returns {Collection<module:"discord.js".Snowflake, module:"discord.js".GuildMember>}
	 */
	static getMods(message) {
		return message.guild?.members.cache.filter(m => message.guild.owner !== m && !m.user.bot && (m.permissions.has('BAN_MEMBERS', false) || m.permissions.has('KICK_MEMBERS', false)));
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const admins = ListerStaffCommand.getAdmins(message);
		const mods = ListerStaffCommand.getMods(message);
		const bots = ListerStaffCommand.getBots(message);

		const embed = new MessageEmbed();
		embed.setTimestamp();
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		embed.setDescription(`<:owner:577839458393784320> **Créateur : **${message.guild.owner}`);
		embed.setColor('#0faf2f');

		if (admins.size > 0)
			embed.addField(
				'<:inventaire:635159040510656512> Administrateurs :',
				admins
					.array()
					.sort((a, b) => a.displayName.localeCompare(b.displayName))
					.join('\n')
			);
		if (mods.size > 0)
			embed.addField(
				'<:bug:635159047284195328> Modérateurs :',
				mods
					.array()
					.sort((a, b) => a.displayName.localeCompare(b.displayName))
					.join('\n')
			);
		if (bots.size > 0)
			embed.addField(
				'<:bot:638858747351007233> Bots :',
				bots
					.array()
					.sort((a, b) => a.displayName.localeCompare(b.displayName))
					.join('\n')
			);

		await super.send(embed);
	}
};
