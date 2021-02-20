const Command = require('../Command.js');
const {formatDate} = require('../../utils/FormatUtils.js');
const {getTime} = require('../../utils/FormatUtils.js');
const {BetterEmbed} = require('discord.js-better-embed');
const {ARG_TYPES} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');

module.exports = class SanctionCommand extends Command {
	/**
	 * @type {'ban' | 'kick' | 'warn' | 'mute'}
	 */
	type;

	constructor(options) {
		super(options);
		this.type = options.type;
	}

	/**
	 * Enregistre un membre dans la DB.
	 * @param {GaliClient} client - Le client.
	 * @param {module:"discord.js".Message} message - Message
	 * @param {module:"discord.js".GuildMember} person - Le membre.
	 * @returns {void}
	 */
	static registerUser(client, message, person) {
		if (!client.dbManager.userInfos.has(message.guild.id)) client.dbManager.userInfos.set(message.guild.id, {});
		if (!client.dbManager.userInfos.has(message.guild.id, person.user.id)) {
			client.dbManager.userInfos.set(
				message.guild.id,
				{
					sanctions: [],
				},
				person.user.id
			);
		}
	}

	/**
	 * Applique la sanction si celle-ci a un impact sur discord.
	 * @param {GuildMember} person - La personne à sanctionner.
	 * @param {string} reason - La raison.
	 * @returns {Promise<void>} - Rien.
	 */
	async applySanction(person, reason) {
		switch (this.type) {
			case 'ban':
				await person.ban({
					days: 7,
					reason,
				});
				break;
			case 'kick':
				await person.kick(reason);
				break;
		}
	}

	/**
	 * Créé la sanction, l'enregistre et envoie l'embed et renvoie la raison.
	 * @param {GuildMember} person - La personne à sanctionner.
	 * @returns {Promise<string>} - La raison.
	 */
	async createSanction(person) {
		let reason = 'Raison non spécifiée.';
		this.args.shift();
		const time = getTime(this.args);
		if (time && time.type) this.args.shift();
		if (this.args.length) reason = this.args.join(' ');
		SanctionCommand.registerUser(this.client, this.message, person);

		this.client.dbManager.userInfos.push(this.message.guild.id, {
			case: this.client.dbManager.userInfos.get(this.message.guild.id, person.user.id).sanctions.length + 1,
			date: Date.now(),
			reason,
			time: time.value ?? undefined,
			type: this.type,
		}, `${person.user.id}.sanctions`);

		const description = [
			`Membre : ${person}`,
			`ID : ${person.user.id}`,
			`Raison : ${reason}`,
			time.value ? `Temps: ${formatDate(time.type.repeat(2), new Date(time.value))}${time.type}` : '',
			`Serveur : \`${this.message.guild.name}\``,
		]
			.filter(v => v)
			.join('\n');

		let titleSanctionName = 'Bannissement';
		switch (this.type) {
			case 'warn':
				titleSanctionName = 'Avertissement';
				break;
			case 'kick':
				titleSanctionName = 'Éjection';
				break;
			case 'mute':
				titleSanctionName = 'Mute';
				break;
		}

		const embed = BetterEmbed.fromTemplate('complete', {
			client: this.client,
			description,
			title: `${titleSanctionName} (sanction numéro ${this.client.dbManager.userInfos.get(this.message.guild.id, person.user.id).sanctions.length}) :`,
		});

		try {
			await person.user.send(embed);
		} catch (ignore) {
		}
		/* todo SERVCONFIG :
		 if ( !servconfig.hasOwnProperty(message.guild.id) || !servconfig[message.guild.id].hasOwnProperty('sanctionchannel') || servconfig[message.guild.id].sanctionchannel === 'Aucun') {
		 await super.send(embed);
		 } else {
		 const sanctionChannel = message.guild.channels.get(servconfig[message.guild.id].sanctionchannel);
		 if (sanctionChannel !== undefined || true) sanctionChannel.send(embed);
		 }*/

		tryDeleteMessage(this.message);
		await super.send(embed);
		return reason;
	}

	/**
	 * Récupère le membre à sanctionner.
	 * @param {module:"discord.js".Message} message - Le message.
	 * @returns {module:"discord.js".GuildMember | Promise<module:"discord.js".Message> | void} - Le membre ou une erreur.
	 */
	getPerson(message) {
		/**
		 * @type {module:"discord.js".GuildMember}
		 */
		const person = getArg(message, 1, ARG_TYPES.MEMBER);
		if (!person) return argError(message, this, "La personne n'a pas été trouvée.");

		if (!person.manageable) {
			return argError(message, this, `Votre rôle est plus bas que la personne que vous tentez ${this.type === 'ban' ?
			                                                                                          'de bannir' :
			                                                                                          this.type === 'kick' ? 'd\'éjecter' : 'd\'avertir'}, vous n'avez donc pas le droit.`);
		}

		if (person.user.id === this.client.user.id && this.type !== 'warn') {
			return super.send(`Désolé mais je ne peux pas ${this.type === 'ban' ? 'me bannir' : "m'éjecter"} moi-même.`);
		}

		return person;
	}

	async run(client, message, args) {
		await super.run(client, message, args);
	}
};
