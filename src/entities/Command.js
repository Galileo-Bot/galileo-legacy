const {formatWithRange} = require('../utils/FormatUtils.js');
const {sendLogMessage} = require('../utils/Utils.js');
const {MessageEmbed} = require('discord.js');

module.exports = class Command {
	aliases;
	args = [];
	category;
	client;
	clientPermissions;
	cooldown;
	description;
	message;
	name;
	tags;
	usage;
	userPermissions;

	/**
	 * Créé une nouvelle commande.
	 * @param {CommandOptions} options - Les options de la commande.
	 */
	constructor(options) {
		this.aliases = options?.aliases ?? [];
		this.category = options?.category ?? 'none';
		this.clientPermissions = options?.clientPermissions ?? [];
		this.cooldown = options?.cooldown ?? 0;
		this.description = options?.description ?? '';
		this.name = options.name;
		this.tags = options?.tags ?? [];
		this.usage = options?.usage ?? '';
		this.userPermissions = options?.userPermissions ?? [];
	}

	/**
	 * Fonction exécutée quand la commande est exécutée.
	 * @param {GaliClient} client - Le client.
	 * @param {Message} message - Le message.
	 * @param {string[]} [args = []] - Les arguments.
	 * @returns {Promise<void>}
	 */
	async run(client, message, args = []) {
		this.client = client;
		this.message = message;
		this.args = args;

		const embed = new MessageEmbed();
		embed.setAuthor(`La commande ${this.name} a été exécutée :`, message.author.displayAvatarURL());
		embed.addField(
			'Informations :',
			`Envoyé ${message.guild ? `sur : **${message.guild?.name}** (\`${message.guild?.id}\`)\nDans : ${message.channel} (\`${message.channel.id}\`)` : 'en privé'}\nEnvoyé par : ${
				message.author
			} (\`${message.author.id}\`)`
		);
		embed.addField('Message :', formatWithRange(message.content, 1024));
		embed.setColor('RANDOM');
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		embed.setTimestamp();
		if (message.attachments.array()[0]?.height) embed.setImage(message.attachments.array()[0].url);
		if (!embed.image && message.embeds[0]?.image?.height) embed.setImage(message.embeds[0].image.url);
		if (message.guild) embed.setThumbnail(message.guild.iconURL());

		sendLogMessage(client, 'command', embed);
	}

	/**
	 * Envoie un message.
	 * @param {StringResolvable|APIMessage} [content=''] - Le contenu à envoyer.
	 * @param {MessageOptions|MessageAdditions} [options={}] - Les options à fournir.
	 * @returns {Promise<Message>} - Le résultat du message.
	 */
	async send(content, options) {
		// Est censé virer les mentions everyone en texte.
		if (
			this.message.guild &&
			!this.message.guild?.members.cache
				.filter(m => this.message.guild.ownerID !== m.user.id && !m.user.bot && m.permissions.has('ADMINISTRATOR'))
				?.map(m => m.user.id)
				.includes(this.message.author.id)
		) {
			if (typeof content === 'string') content = content.replace(/@(everyone|here)/, '@ $1');
			if (options?.content) options.content = options?.content.replace(/@(everyone|here)/, '@**$1**');
		}

		return await this.message.channel?.send(content, options);
	}
};
