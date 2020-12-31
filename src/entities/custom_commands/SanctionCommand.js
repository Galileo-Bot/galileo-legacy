const Command = require('../Command.js');
const {BetterEmbed} = require('discord.js-better-embed');
const {argTypes} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');

module.exports = class SanctionCommand extends Command {
	type;

	constructor(options) {
		super(options);
		this.type = options.type;
	}

	/**
	 * Applique la sanction si celle-ci a un impact sur discord.
	 * @param {GuildMember} person - La personne à sanctionner.
	 * @param {string} reason - La raison.
	 * @returns {Promise<void>} - Rien.
	 */
	async applySanction(person, reason) {
		if (this.type === 'ban') {
			await person.ban({
				days: 7,
				reason,
			});
		} else if (this.type === 'kick') await person.kick(reason);
	}

	/**
	 * Créé la sanction, l'enregistre et envoie l'embed et renvoie la raison.
	 * @param {GuildMember} person - La personne à sanctionner.
	 * @returns {Promise<string>} - La raison.
	 */
	async createSanction(person) {
		let reason = 'Raison non spécifiée.';
		if (this.args.length > 1) reason = this.args.slice(1, this.args.length).join(' ');
		SanctionCommand.registerUser(this.client, this.message, person);

		this.client.dbManager.userInfos.push(
			this.message.guild.id,
			{
				type: this.type,
				reason,
				date: Date.now(),
				case: this.client.dbManager.userInfos.get(this.message.guild.id, person.user.id).sanctions.length + 1,
			},
			`${person.user.id}.sanctions`
		);

		const embed = BetterEmbed.fromTemplate('complete', {
			client: this.client,
			description: `${this.type === 'ban' ? 'Utilisez la commande `infractions` pour dé-bannir la personne.\n\n' : ''}Membre : ${person}\nID : ${person.user.id}\nServeur : \`${
				this.message.guild.name
			}\``,
			title: `Bannissement (sanction numéro ${this.client.dbManager.userInfos.get(this.message.guild.id, person.user.id).sanctions.length}) :`,
		});
		person.user.send(embed).catch(() => {});

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
	 * Récupère le membre à sanctionner.
	 * @param {module:"discord.js".Message} message - Le message.
	 * @returns {module:"discord.js".GuildMember|void} - Le membre ou une erreur.
	 */
	getPerson(message) {
		/**
		 * @type {module:"discord.js".GuildMember}
		 */
		const person = getArg(message, 1, argTypes.member);
		if (!person) return argError(message, this, "La personne n'a pas été trouvée.");

		if (message.member.roles.cache.map(r => r).sort((b, a) => a.position - b.position)[0].position < person.roles.cache.map(r => r).sort((b, a) => a.position - b.position)[0].position) {
			return argError(
				message,
				this,
				`Votre rôle est plus bas que la personne que vous tentez ${this.type === 'ban' ? 'de bannir' : this.type === 'kick' ? "d'éjecter" : "d'avertir"}, vous n'avez donc pas le droit.`
			);
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
