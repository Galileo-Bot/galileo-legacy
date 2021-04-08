const {MessageEmbed, Util} = require('discord.js');
const {ARG_TYPES, USER_FLAGS} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const Command = require('../../entities/Command.js');
const dayjs = require('dayjs');
const {isOwner} = require('../../utils/Utils.js');

module.exports = class UserInfoCommand extends Command {
	constructor() {
		super({
			aliases: ['ui', 'mi', 'user-info'],
			description: "Permet d'avoir des informations sur un membre ou sur vous-même.",
			name: 'userinfo',
			usage: 'userinfo <Nom/ID/Mention de membre>\nuserinfo',
		});
	}

	static getActivityTypeInFrench(type) {
		return type === 'STREAMING' ? 'Stream' : type === 'LISTENING' ? 'Écoute' : type === 'WATCHING' ? 'Regarde' : type === 'COMPETE' ? 'En compétition de' : 'Joue à';
	}

	static getStatus(person, statusEmoji, status) {
		switch (person.user.presence.status) {
			case 'online':
				statusEmoji = '<a:onlinegif:539121217534427136>';
				status = 'En ligne';
				break;
			case 'idle':
				statusEmoji = '<a:idlegif:539121217001750528>';
				status = 'AFK (Inactif)';
				break;
			case 'dnd':
				statusEmoji = '<a:dndgif:539121214854135845>';
				status = 'Ne pas déranger';
				break;
			case 'offline':
				statusEmoji = '<a:offlinegif:606503282361237504>';
				status = 'Déconnecté';
				break;
		}
		return {
			status,
			statusEmoji,
		};
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		let permission = 'Utilisateur(rice)';
		let permServer = 'Membre';
		let status = 'Hors ligne';
		let statusEmoji = '<a:onlinegif:539121217534427136>';
		let person = {
			user: message.author,
		};

		if (message.guild) {
			person = await (getArg(message, 1, ARG_TYPES.MEMBER) ?? message.member).fetch();
			if (person.roles.cache.has('537624009639198731')) permission = 'Testeur(se)';
			if (person.permissions.has('KICK_MEMBERS', true)) permServer = 'Modérateur(rice)';
			if (person.permissions.has('ADMINISTRATOR', true)) permServer = 'Administrateur(se)';
			if (person === message.guild.owner) permServer = 'Créateur';
		}

		/**
		 * @type {UserFlags}
		 */
		const flags = await person.user.fetchFlags();
		if (isOwner(person.user.id)) permission = 'Créateur';

		const statusResult = UserInfoCommand.getStatus(person, statusEmoji, status);
		statusEmoji = statusResult.statusEmoji;
		status = statusResult.status;

		if (person.user.presence.activities.length > 0) {
			const activity = person.user.presence.activities[0];
			status = activity.type === 'CUSTOM_STATUS' ? `**${activity.state}**` : `${UserInfoCommand.getActivityTypeInFrench(activity.type)} **${activity.name}**`;
		}

		const embed = new MessageEmbed();
		embed.setTimestamp();
		embed.setColor('#4b5afd');
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		embed.setThumbnail(person.user.displayAvatarURL());
		embed.setAuthor(
			`Informations sur ${person.user.tag} :`,
			person.user.displayAvatarURL({
				dynamic: true,
			})
		);
		embed.addField('🆔 : ', person.user.id, true);
		embed.addField('<:textuel:635159053630308391> Nom : ', person.user, true);
		if (message.guild) {
			embed.addField('<:richtext:635163364875698215> Permission du serveur :', permServer, true);

			const roles = Util.discordSort(person.roles.cache).array().reverse().join(' | ');
			const percentage = Math.round((person.roles.cache.size / message.guild.roles.cache.size) * 100);
			embed.addField('<:category:635159053298958366> Rôles', `${roles}\n**${person.roles.cache.size}** rôles. (**${percentage}%** des rôles du serveur)`);
			embed.addField("🛬 Date d'arrivée sur le serveur :", dayjs(person.joinedAt).format('DD/MM/YYYY hh:mm'), true);
		}
		embed.addField('🚩 Date de création du compte :', dayjs(person.user.createdAt).format('DD/MM/YYYY hh:mm'), true);
		if (!person.user.bot) embed.addField('<:richtext:635163364875698215> Permissions sur le bot :', permission, true);
		embed.addField(`${statusEmoji} Statut :`, status, true);

		if (flags.toArray().length > 0) {
			embed.addField(
				'Propriétés spéciales :',
				flags
					.toArray()
					.map(flag => USER_FLAGS[flag])
					.sort(new Intl.Collator().compare)
					.join('\n')
			);
		}

		await super.send(embed);
		tryDeleteMessage(message);
	}
};
