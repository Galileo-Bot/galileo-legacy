const {formatWithRange} = require('./FormatUtils.js');
const Logger = require('./Logger.js');
const Embed = require('./Embed.js');
const {permissions} = require('../constants.js');
const {isOwner, sendLogMessage, getShortPrefix} = require('./Utils.js');

/**
 * Envoie une erreur d'argument.
 * @param {Message} message - Message où envoyer l'argError.
 * @param {Command} command - La commande erronnée.
 * @param {string} error - L'erreur.
 * @returns {void}
 */
function argError(message, command, error) {
	const {verifyCommand} = require('./CommandUtils.js');
	const embed = Embed.fromTemplate('author', {
		client: message.client,
		author: 'Vous avez fait une erreur au niveau des arguments.',
		authorURL: message.author.displayAvatarURL({
			dynamic: true,
		}),
		description: `Erreur : ${error}`,
	});

	embed.setColor('#ff792a');
	const verification = verifyCommand(command, message);
	if (verification.tags.length === 0 && verification.missingPermissions.user.length === 0 && verification.missingPermissions.client.length === 0)
		embed.addField("Rappel d'utilisation :", `\`${command.usage}\``);
	embed.setFooter(`Faites ${getShortPrefix()}help ${command.name} pour avoir plus d'aide.`);

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
	const embed = Embed.fromTemplate('author', {
		client: message.client,
		author: `Permissions ${fromBot ? 'du bot' : ''} manquantes.`,
		authorURL: message.author.displayAvatarURL({
			dynamic: true,
		}),
		description: `\`${missingPermissions
			.map(perm => permissions[perm])
			.sort(new Intl.Collator().compare)
			.join(', ')}\``,
	});
	embed.setColor('#ffc843');
	embed.setTitle(`Commande : ${command.name}`);
	embed.addField("Rappel d'utilisation :", `\`${command.usage}\``);
	embed.setFooter(`Faites ${getShortPrefix()}help ${command} pour récupérer les permissions de la commande.`);

	message.channel?.send(embed);
}

/**
 * Exécute une erreur pour le bot.
 * @param {Message} message - Le message de l'erreur.
 * @param {Command} command - La commande qui a provoquée cette erreur.
 * @param {any} error - L'erreur.
 * @returns {any} - Je sais pas xD
 */
async function runError(message, command, error) {
	const embedLog = Embed.fromTemplate('basic', {
		client: message.client,
	});
	const embed = Embed.fromTemplate('basic', {
		client: message.client,
	});
	embedLog.setColor('#dd0000');
	embedLog.setDescription(`Une erreur a eu lieu avec la commande : **${command.name}**.`);
	embedLog.addField(
		'Informations :',
		`\nEnvoyé par : ${message.author} (\`${message.author.id}\`)\n\n${
			message.guild ? `Sur : **${message.guild.name}** (\`${message.guild.id}\`)\n\nDans : ${message.channel} (\`${message.channel.id})\`` : 'Envoyé en messages privés.'
		}`
	);

	embedLog.addField('Erreur :', formatWithRange(error.stack, 1024));
	embedLog.addField('Message :', formatWithRange(message.content, 1024));
	if (message.attachments.array()[0]?.height) embed.setImage(message.attachments.array()[0].url);
	if (!embed.image && message.embeds[0]?.image?.height) embed.setImage(message.embeds[0].image.url);
	if (message.guild) embed.setThumbnail(message.guild.iconURL());

	if (isOwner(message.author.id)) return message.channel?.send(embedLog);

	embed.setDescription(`> Une erreur a eu lieu avec la commande : **${command.name}**.\n\n**__L'erreur a été avertie aux développeurs.__**`);
	embed.setColor('RANDOM');

	await message.channel?.send(embed);
	await sendLogMessage(message.client, 'bug', embedLog);
}

module.exports = {
	argError,
	permsError,
	runError,
};
