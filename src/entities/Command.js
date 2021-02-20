const {BetterEmbed} = require('discord.js-better-embed');
const {formatWithRange} = require('../utils/FormatUtils.js');
const {sendLogMessage} = require('../utils/Utils.js');

/**
 * @type {import("../../index.d.ts").Command}
 */
module.exports = class Command {
	aliases = [];
	args = [];
	category = 'none';
	client = undefined;
	clientPermissions = [];
	cooldown = 0;
	description = '';
	message = undefined;
	name;
	tags = [];
	usage = '';
	userPermissions = [];

	/**
	 * Créé une nouvelle commande.
	 * @param {CommandOptions} options - Les options de la commande.
	 */
	constructor(options) {
		Object.assign(this, options);
	}

	/**
	 * Fonction exécutée quand la commande est exécutée.
	 * @param {GaliClient} client - Le client.
	 * @param {Message} message - Le message.
	 * @param {string[]} [args = []] - Les arguments.
	 * @returns {Promise<void>} - N'importe.
	 */
	async run(client, message, args = []) {
		this.client = client;
		this.message = message;
		this.args = args;

		const embed = BetterEmbed.fromTemplate('author', {
			author: `La commande ${this.name} a été exécutée :`,
			authorURL: message.author.displayAvatarURL({
				dynamic: true,
			}),
			client,
			description: `Envoyé ${
				message.guild ? `sur : **${message.guild.name}** (\`${message.guild.id}\`)\nDans : ${message.channel} (\`${message.channel.id}\`)` : 'en privé'
			}\nEnvoyé par : ${message.author} (\`${message.author.id}\`)`,
		});
		embed.addField('Message :', formatWithRange(message.content, 1024));
		embed.setColor('RANDOM');

		if (message.attachments.array()[0]?.height) embed.setImage(message.attachments.array()[0].url);
		if (!embed.image && message.embeds[0]?.image?.height) embed.setImage(message.embeds[0].image.url);
		if (message.guild) embed.setThumbnail(message.guild.iconURL());

		await sendLogMessage(client, 'COMMAND', embed);
	}

	/**
	 * Envoie un message.
	 * @param {StringResolvable | APIMessage} [content=''] - Le contenu à envoyer.
	 * @param {MessageOptions | MessageAdditions} [options={}] - Les options à fournir.
	 * @returns {Promise<Message>} - Le résultat du message.
	 */
	async send(content, options) {
		if (
			this.message.guild &&
			!this.message.guild?.members.cache
				.filter(m => this.message.guild.ownerID !== m.user.id && !m.user.bot && m.permissions.has('ADMINISTRATOR'))
				?.map(m => m.user.id)
				.includes(this.message.author.id)
		) {
			if (typeof content !== 'string') {
				options = content;
				content = '';
			}

			options = Object.assign(options ?? {}, {
				disableMentions: 'everyone',
			});

			return this.message.channel?.send(content, options);
		}

		return this.message.channel?.send(content, options);
	}
};
