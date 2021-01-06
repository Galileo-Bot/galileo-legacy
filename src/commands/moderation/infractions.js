const Command = require('../../entities/Command.js');
const SanctionCommand = require('../../entities/custom_commands/SanctionCommand.js');
const {BetterEmbed} = require('discord.js-better-embed');
const {ARG_TYPES, TAGS} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');

module.exports = class InfractionsCommand extends Command {
	constructor() {
		super({
			aliases: ['infraction'],
			description: "Permet de modifier/supprimer/voir les infractions d'un membre ou de vous-même.",
			name: 'infractions',
			tags: [TAGS.GUILD_ONLY],
			usage:
				'infractions <Nom/ID/Mention de membre> modifier <numéro de cas> <nouvelle raison>\ninfractions <Nom/ID/Mention de membre> supprimer <numéro de cas>\ninfractions <Nom/ID/Mention de membre> supprimer toutes\ninfractions [Nom/ID/Mention de membre] [page]',
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
		});
	}

	/**
	 * Créé une page pour l'embed suivant les données de l'utilisateur.
	 * @param {UserInfo} userData - Les données de l'utilisateur.
	 * @param {number} pageNumber - La page par défaut à charger.
	 * @param {module:"discord.js".User} user - L'utilisateur.
	 * @param {BetterEmbed} embed - L'embed.
	 */
	createPage(userData, pageNumber, user, embed) {
		const pageMax = Math.floor(userData.sanctions.length / 10) + 1;
		let page = pageNumber ?? 0;
		let warns = 0;
		let bans = 0;
		let kicks = 0;
		let mutes = 0;

		if (this.args[2] > pageMax || this.args[2] < 1 || !Number.parseInt(this.args[2])) page = pageMax;

		const embedDesc = userData.sanctions
			.map(({case: caseNumber, reason, type}) => {
				if (type === 'warn') warns++;
				else if (['ban', 'tempban'].includes(type)) bans++;
				else if (type === 'kick') kicks++;
				else if (['tempmute', 'mute'].includes(type)) mutes++;

				return `**cas ${caseNumber}** |** __${type}__**\t|\t${reason}`;
			})
			.slice(page * 10 - 10, page * 10)
			.join('\n');

		embed.setAuthor(`Sanctions de : ${user.tag}`, user.displayAvatarURL());
		embed.setDescription(`Bannissements : **${bans}** Éjections : **${kicks}** Silences : **${mutes}** Avertissements : **${warns}**\n\n${embedDesc}`);
		embed.setFooter(`${this.client.user.username} • Page ${page}/${pageMax}`, this.client.user.displayAvatarURL());

		super.send(embed);
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const person = getArg(message, 1, ARG_TYPES.MEMBER) ?? message.member;
		const embed = BetterEmbed.fromTemplate('basic', {
			client,
		});
		embed.setColor('#4b5afd');

		const page = getArg(message, 1, ARG_TYPES.NUMBER);

		SanctionCommand.registerUser(this.client, this.message, person);

		if (args[1] === 'supprimer') {
			if (['toutes', 'all', 'tout'].includes(args[2])) {
				if (this.client.dbManager.userInfos.get(message.guild.id, person.user.id).sanctions.find(s => s.type === 'ban')) {
					message.guild.members
						.unban(person.user.id)
						.catch(() => super.send('Une erreur a eu lieu dans le débanissement de ce membre, vérifiez que le bot ait la permission de bannir les membres.'));
				}

				this.client.dbManager.userInfos.set(message.guild.id, [], `${person.user.id}.sanctions`);
				return super.send(`Toutes les sanctions de ${person.user.tag} ont été supprimées.`);
			}

			if (getArg(message, 3, ARG_TYPES.NUMBER) === null) {
				return argError(message, this, "Veuillez mettre `toutes` ou le numéro d'une sanction valide.");
			} else {
				//	if (sanction.sanction === 'mute' && servconfig[message.guild.id]['rolemute'] !== 'Aucun') person.roles.cache.remove(servconfig[message.guild.id]['rolemute']);
				// todo ServeurInfo + mute

				const sanction = this.client.dbManager.userInfos.get(message.guild.id, person.user.id).sanctions.find(s => s.case.toString() === args[2]);
				if (sanction) {
					if (sanction.type === 'ban') message.guild.members.unban(person.user.id).catch(() => {});
					this.client.dbManager.userInfos.remove(message.guild.id, s => s === sanction, `${person.user.id}.sanctions`);
					return super.send(`La sanction ${args[2]} a bien été supprimée. \`(${sanction.type})\``);
				} else return argError(message, this, `La sanction ${args[2]} n'a pas été trouvée ou n'est pas valide.`);
			}
		} else if (args[1] === 'modifier') {
			if (getArg(message, 3, ARG_TYPES.NUMBER) === null) {
				return argError(message, this, "Veuillez mettre le numéro d'une sanction valide.");
			} else {
				const sanction = client.dbManager.userInfos.get(message.guild.id, `${person.user.id}.sanctions`).find(s => s.case.toString() === args[2]);
				if (sanction) {
					if (args.length === 3) return argError(message, this, 'Veuillez mettre la nouvelle raison de cette sanction.');
					const sanctions = client.dbManager.userInfos.get(message.guild.id, `${person.user.id}.sanctions`);
					const reason = args.slice(3).join(' ');

					sanctions.find(s => s.case.toString() === args[2]).reason = reason;
					client.dbManager.userInfos.set(message.guild.id, sanctions, `${person.user.id}.sanctions`);

					return super.send(`La sanction ${args[2]} a bien été modifiée en \`${reason}\`.\n\`(${sanction.type})\``);
				} else return argError(message, this, `La sanction ${args[2]} n'a pas été trouvée ou n'est pas valide.`);
			}
		}

		this.createPage(client.dbManager.userInfos.get(message.guild.id, person.user.id), page, person.user, embed);
	}
};
