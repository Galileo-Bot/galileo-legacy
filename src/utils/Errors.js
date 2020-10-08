const {MessageEmbed} = require('discord.js');
const {formatWithRange} = require('./FormatUtils.js');
const Logger = require('./Logger.js');
const {permissions} = require('../constants.js');
const {getPrefixFromMessage, isOwner, sendLogMessage} = require('./Utils.js');

/**
 * Envoie une erreur d'argument.
 * @param {Message} message - Message où envoyer l'argError.
 * @param {Command} command - La commande erronnée.
 * @param {string} error - L'erreur.
 * @returns {void}
 */
function argError(message, command, error) {
	const {verifyCommand} = require('./CommandUtils.js');
	const embed = new MessageEmbed();

	embed.setColor('#ff792a');
	embed.setAuthor('Vous avez fait une erreur au niveau des arguments.', message.author.displayAvatarURL());
	embed.setTitle(`Commande : ${command.name} `);
	embed.setDescription(`Erreur : ${error}`);
	const verification = verifyCommand(command, message);
	if (verification.tags.length === 0 && verification.missingPermissions.user.length === 0 && verification.missingPermissions.client.length === 0)
		embed.addField("Rappel d'utilisation :", `\`${command.usage}\``);
	embed.setFooter(`Faites ${getPrefixFromMessage(message)}help ${command} pour avoir plus d'aide.`);
	embed.setFooter(message.client.user.username, message.client.user.displayAvatarURL());
	embed.setTimestamp();

	message.channel?.send(embed);
	Logger.info(`'${message.author.tag}' (${message.author.id} a raté la commande '${command.name}', raison : ${error}`, 'MessageEvent');
}

/**
 * Envoie une erreur de permissions.
 * @param {Message} message - Le message pour récupérer où envoyer l'erreur.
 * @param {Command} command - La commande erronée.
 * @param {string[]} missingPermissions - Les permissions manquantes.
 * @param {boolean} [fromBot = false] - Si ça vient d'un bot faut mettre true (ça change un peu le message).
 * @returns {void}
 */
function permsError(message, command, missingPermissions, fromBot = false) {
	const embed = new MessageEmbed();
	embed.setColor('#ffc843');
	embed.setAuthor(
		`Permissions ${fromBot ? 'du bot' : ''} manquantes.`,
		message.author.displayAvatarURL({
			dynamic: true,
			format: 'png',
		})
	);
	embed.setTitle(`Commande : ${command.name}`);
	embed.setDescription(
		`\`${missingPermissions
			.map(perm => permissions[perm])
			.sort()
			.join(', ')}\``
	);
	embed.addField("Rappel d'utilisation :", `\`${command.usage}\``);
	embed.setFooter(`Faites ${getPrefixFromMessage(message)}help ${command} pour récupérer les permissions de la commande.`);
	embed.setFooter(message.client.user.username, message.client.user.displayAvatarURL());
	embed.setTimestamp();

	message.channel?.send(embed);
}

/**
 * Exécute une erreur pour le bot.
 * @param {Message} message - Le message de l'erreur.
 * @param {Command} command - La commande qui a provoquée cette erreur.
 * @param {any} error - L'erreur.
 * @returns {any} - Je sais pas xD
 */
function runError(message, command, error) {
	const embed = new MessageEmbed();
	const embedLog = new MessageEmbed();
	embedLog.setColor('#dd0000');

	// En cas d'erreur avec une commande et que l'auteur du message est un créateur.
	embedLog.setDescription(`Une erreur a eu lieu avec la commande : **${command.name}**.`);
	embedLog.addField(
		'Informations :',
		`\nEnvoyé par : ${message.author} (\`${message.author.id}\`)\n\n${
			message.guild ? `Sur : **${message.guild.name}** (\`${message.guild.id}\`)\n\nDans : ${message.channel} (\`${message.channel.id})\`` : 'Envoyé en messages privés.'
		}`
	);

	embedLog.addField('Erreur :', formatWithRange(error.stack, 1024));
	embedLog.addField('Message :', formatWithRange(message.content, 1024));
	embed.setFooter(message.client.user.username, message.client.user.displayAvatarURL());
	embed.setTimestamp();
	if (message.attachments.array()[0]?.height) embed.setImage(message.attachments.array()[0].url);
	if (!embed.image && message.embeds[0]?.image?.height) embed.setImage(message.embeds[0].image.url);
	if (message.guild) embed.setThumbnail(message.guild.iconURL());

	if (isOwner(message.author.id)) return message.channel?.send(embedLog);

	embed.setDescription(`> Une erreur a eu lieu avec la commande : **${command.name}**.\n\n**__L'erreur a été avertie aux développeurs.__**`);
	embed.setColor('RANDOM');

	message.channel?.send(embed);
	sendLogMessage(message.client, 'bug', embedLog);
}

module.exports = {
	argError,
	permsError,
	runError,
};
