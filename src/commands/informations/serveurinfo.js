const {MessageEmbed} = require('discord.js');
const {formatDate} = require('../../utils/FormatUtils.js');
const Command = require('../../entities/Command.js');
const {guildFeatures, tags} = require('../../constants.js');

module.exports = class ServeurInfoCommand extends (
	Command
) {
	constructor() {
		super({
			name: 'serveurinfo',
			aliases: ['si', 'servi', 'serveur-info'],
			description: "Permet d'avoir des informations sur le serveur où vous êtes.",
			tags: [tags.guild_only],
		});
	}

	/**
	 * @param {GaliClient} client - Le client.
	 * @param {Message} message - Le message.
	 * @param {String[]} args - Les arguments.
	 * @returns {Promise<void>} - Rien.
	 */
	async run(client, message, args) {
		super.run(client, message, args);

		const {premiumTier, premiumSubscriptionCount, roles, memberCount, me, name, id, channels, createdAt, owner, features} = await message.guild.fetch();
		const members = await message.guild.members.fetch();

		const {size: guildMembersBot} = members.filter(m => m.presence.status === 'offline' && !m.user.bot);
		const {size: guildMembersDnd} = members.filter(m => m.presence.status === 'dnd' && !m.user.bot);
		const {size: guildMembersIdle} = members.filter(m => m.presence.status === 'idle' && !m.user.bot);
		const {size: guildMembersOnline} = members.filter(m => m.presence.status === 'online' && !m.user.bot);

		const {size: voiceChannelsSize} = channels.cache.filter(c => c.type === 'voice');
		const {size: textChannelsSize} = channels.cache.filter(c => c.type === 'text');
		const {size: categoryChannelsSize} = channels.cache.filter(c => c.type === 'category');
		const {size: newsChannelsSize} = channels.cache.filter(c => c.type === 'news');

		const embed = new MessageEmbed();
		embed.setTimestamp();
		embed.setColor('#21fd20');
		embed.setThumbnail(
			message.guild.iconURL({
				dynamic: true,
			})
		);
		embed.setFooter(`Nombre de membres faux à cause d'un bug de Discord sur leur fonctionnalité "Intents".\n\n${client.user.username}`, client.user.displayAvatarURL());
		embed.setAuthor(
			`Informations sur le serveur ${name} : `,
			message.guild.iconURL({
				dynamic: true,
			})
		);

		embed.addField('🆔 :', id, true);
		if (owner) embed.addField('<:owner:577839458393784320> Propriétaire :', `${owner.user} (${owner.user.id})`);

		embed.addField(
			'<:hey:635159039831048202> Membres :',
			`
**__Total__** : ${memberCount}

<:online:635159040384696330> En ligne : **${guildMembersOnline}** (**${Math.round((guildMembersOnline / memberCount) * 1000) / 10}**%)
<:idle:635159039852019722> Absents : **${guildMembersIdle}** (**${Math.round((guildMembersIdle / memberCount) * 1000) / 10}**%)
<:dnd:635159040162529343> Ne pas déranger : **${guildMembersDnd}** (**${Math.round((guildMembersDnd / memberCount) * 1000) / 10}**%)
<:offline:635159036634988594> Hors ligne : ** ${guildMembersBot}** (**${Math.round((guildMembersBot / memberCount) * 1000) / 10}**%)

<:bot:638858747351007233> Bots : **${members.filter(m => m.user.bot).size}** (**${Math.round((members.filter(m => m.user.bot).size / memberCount) * 1000) / 10}**%)
`,
			true
		);

		embed.addField(
			'<:textuel:635159053630308391> Salons :',
			`
**__Total__** : ${channels.cache.size}

<:bnote:635163385645760523> Textuels : **${textChannelsSize}** (**${Math.round((textChannelsSize / channels.cache.size) * 1000) / 10}%**)
<:vocal:635159054582284350> Vocaux : **${voiceChannelsSize}** (**${Math.round((voiceChannelsSize / channels.cache.size) * 1000) / 10}%**)
<:category:635159053298958366> Catégories : **${categoryChannelsSize}** (**${Math.round((categoryChannelsSize / channels.cache.size) * 1000) / 10}%**)
<:announce:738916035041820712> Annonceurs : **${newsChannelsSize}** (**${Math.round((newsChannelsSize / channels.cache.size) * 1000) / 10}%**)
`,
			true
		);

		embed.addField('<:carte:635159034395361330> Rôles :', roles.cache.size);
		embed.addField('<a:disload:635159109280333874> Date de création : ', `Le ${formatDate('dd/MM/yyyy à hh:mm', createdAt)}`, true);
		embed.addField("<:richtext:635163364875698215> Date d'invitation du bot :", `Le ${formatDate('dd/MM/yyyy à hh:mm', me.joinedAt)}`);

		if (premiumTier > 0) embed.addField('Niveau de boost : ', premiumTier, true);
		if (premiumSubscriptionCount > 0) embed.addField('Nombre de personnes boostant le serveur : ', premiumSubscriptionCount, true);
		if (features.length > 0)
			embed.addField(
				'Fonctionnalités :',
				features
					.map(feature => guildFeatures[feature])
					.sort()
					.join('\n')
			);

		await super.send(embed);
	}
};
