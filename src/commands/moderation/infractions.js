const {MessageEmbed} = require('discord.js');
const Command = require('../../entities/Command.js');
const {runError} = require('../../utils/Errors.js');
const {readJSON} = require('../../utils/Utils.js');
const {argTypes, tags} = require('../../constants.js');
const {getArg, getArgWithContent} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');
const {writeInJSON} = require('../../utils/Utils.js');

module.exports = class InfractionsCommand extends Command {
	constructor() {
		super({
			name: 'infractions',
			description: "Permet de modifier/supprimer/voir les infractions d'un membre ou de vous-même.",
			usage:
				'infractions <Nom/ID/Mention de membre> modifier <numéro de cas> <nouvelle raison>\ninfractions <Nom/ID/Mention de membre> supprimer <numéro de cas>\ninfractions <Nom/ID/Mention de membre> supprimer toutes\ninfractions [Nom/ID/Mention de membre] [page]',
			tags: [tags.guild_only],
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
		});
	}

	createPage(userData, pageNumber, user, embed) {
		const pageMax = Math.floor(userData[this.message.guild.id][user.id].sanctions.length / 10) + 1;
		let page = pageNumber;
		let warns = 0;
		let bans = 0;
		let kicks = 0;
		let mutes = 0;

		if (this.args[2] > pageMax || this.args[2] < 1 || !parseInt(this.args[2])) page = pageMax;

		const embedDesc = userData[this.message.guild.id][user.id].sanctions
			.map(({case: caseNumber, reason, sanction: sanctionType}) => {
				if (sanctionType === 'warn') warns++;
				else if (['ban', 'tempban'].includes(sanctionType)) bans++;
				else if (sanctionType === 'kick') kicks++;
				else if (['tempmute', 'mute'].includes(sanctionType)) mutes++;

				return `**cas ${caseNumber}** |** __${sanctionType}__**\t|\t${reason}`;
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

		const userData = readJSON('./assets/jsons/userdata.json');
		const person = getArg(message, 1, argTypes.member) ?? message.member;
		const embed = new MessageEmbed();
		embed.setTimestamp();
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		embed.setColor('#4b5afd');

		const page = args.length > 2 ? args[2] : 0;

		if (!userData[message.guild.id].hasOwnProperty(person.user.id) || !userData[message.guild.id][person.user.id].hasOwnProperty('sanctions')) {
			userData[message.guild.id][person.user.id] = {
				sanctions: [],
			};
			this.writeData(userData);
		}

		if (args[1] === 'supprimer') {
			if (args[2] === 'toutes' || !args[2]) {
				if (userData[message.guild.id][person.user.id].sanctions.find(s => s.sanction === 'ban')) {
					message.guild.members
						.unban(person.user.id)
						.catch(() => super.send('Une erreur a eu lieu dans le débanissement de ce membre, vérifiez que le bot ait la permission de bannir les membres.'));
				}

				userData[message.guild.id][person.user.id].sanctions = [];
				writeInJSON('./assets/jsons/userdata.json', userData);
				return super.send(`Toutes les sanctions de ${person.user.tag} ont été supprimées.`);
			}

			if (getArgWithContent(args[2], argTypes.number)) {
				userData[message.guild.id][person.user.id].sanctions.forEach((sanction, index) => {
					if (args[2] === sanction.case) {
						if (sanction.sanction === 'ban') message.guild.members.unban(person.user.id);
						//	if (sanction.sanction === 'mute' && servconfig[message.guild.id]['rolemute'] !== 'Aucun') person.roles.cache.remove(servconfig[message.guild.id]['rolemute']);
						// todo ServeurInfo + mute

						userData[message.guild.id][person.user.id].sanctions.splice(index, 1);
						writeInJSON('./assets/jsons/userdata.json', userData);
						return super.send(`La sanction ${args[2]} a bien été supprimée. (${sanction.sanction})`);
					}
					return argError(message, this, `La sanction ${args[2]} n'a pas été trouvée ou n'est pas valide.`);
				});
			} else return argError(message, this, "Veuillez mettre `toutes` ou le numéro d'une sanction valide.");
		} else if (args[1] === 'modifier') {
			if (parseInt(args[2])) {
				userData[message.guild.id][person.user.id].sanctions.forEach(sanction => {
					if (args[2] === sanction.case) {
						if (args.length < 4) return argError(message, this, 'Veuillez mettre la nouvelle raison de cette sanction.');

						userData[message.guild.id][person.user.id].sanctions.find(sanction => sanction.case === args[2]).reason = args[3];
						writeInJSON('./assets/jsons/userdata.json', userData);
						return super.send(`La sanction ${args[2]} a bien été modifié. (${sanction.sanction})`);
					}
				});
			}

			return argError(message, this, "Veuillez mettre le numéro d'une sanction valide.");
		}

		return this.createPage(userData, page, person.user, embed);
	}

	writeData(userData) {
		if (!writeInJSON('./assets/jsons/userdata.json', userData)) runError(this.message, this, "Tentative d'écriture dans le fichier './assets/jsons/userdata.json', le fichier n'a pas été trouvé.");
	}
};
