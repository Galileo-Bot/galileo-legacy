const {MessageEmbed} = require('discord.js');
const {argTypes} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const Command = require('../../entities/Command.js');

module.exports = class ServeurListeCommand extends Command {
	constructor() {
		super({
			name: 'serveurliste',
			description: 'Affiche la liste des serveurs en rangeant de façon décroissante des membres et à la page 1 ou celle inscrite.',
			usage: 'serveurliste <nombre>\nserveurliste',
			aliases: ['serverlist', 'sl', 'servlist'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const pageNumberArg = getArg(message, 1, argTypes.number);

		function sortGuildsWithPage(pageNumber) {
			let page = pageNumber;
			const embed = new MessageEmbed();
			const pageMax = Math.ceil(client.guilds.cache.size / 20);
			if (!pageNumber && (!pageNumberArg || pageNumberArg > pageMax || pageNumberArg < 1)) page = pageMax;

			const embedDesc = client.guilds.cache
				.sort((a, b) => b.memberCount - a.memberCount)
				.map(guild => `**${guild.name}**\t|\t**${guild.memberCount}** membres (**${guild.members.cache.filter(m => m.user.bot).size}** bots)`)
				.slice(pageNumber * 20 - 20, page * 20)
				.join('\n');

			embed.setAuthor(`Liste des serveurs de ${page * 20 - 19} à ${page * 20}`);
			embed.setDescription(`Nombre de serveurs : ${client.guilds.cache.size}.\n\n${embedDesc}`);
			embed.setFooter(`${client.user.username} • Page ${page}/${pageMax}`, client.user.displayAvatarURL());
			embed.setColor('#4b5afd');
			embed.setTimestamp();

			return embed;
		}

		let p = args.length > 0 ? args[0] : 1;
		const sl = await super.send(sortGuildsWithPage(p)).catch(err => console.error(err));
		if (client.guilds.cache.size > 20) {
			await sl.react('◀');
			await sl.react('▶');

			const slEvent = sl.createReactionCollector((reaction, user) => user.id === message.author.id);
			slEvent.on('collect', async (reaction, user) => {
				if (user.bot) return;
				switch (reaction.emoji.name) {
					case '◀':
						p--;
						if (p < 0 || !p) p = 0;
						await sl.reactions.cache.find(emote => emote === '◀').users.remove(message.author.id);

						return sl.edit(sortGuildsWithPage(p));

					case '▶':
						p++;
						if (!p || p > Math.round(client.guilds.cache.size / 20)) p = 0; // pas sûr
						await sl.reactions.cache.find(emote => emote === '▶').users.remove(message.author.id);

						return sl.edit(sortGuildsWithPage(p));
				}
			});
		}
	}
};
