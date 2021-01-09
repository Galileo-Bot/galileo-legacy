const {argError, permsError} = require('./Errors.js');
const {isOwner} = require('./Utils.js');
const {TAGS} = require('../constants.js');

/**
 * Renvoie les permissions menquantes d'une commande par rapport à un message (objets vide sinon).
 * @param {Command} command - La commande.
 * @param {Message} message - Le message.
 * @returns {MissingPermissions} - Le résultat, un objet avec 2 arrays contenant les permissions manquantes du membre et du cliebt (bot).
 */
function verifyPermissionsFromCommand(command, message) {
	if (!message.guild)
		return {
			client: [],
			user: [],
		};

	return {
		client: command.clientPermissions.filter(v => !message.channel.permissionsFor(message.guild.me).has(v, false)),
		user: command.userPermissions.filter(v => !message.channel.permissionsFor(message.member).has(v, false)),
	};
}

/**
 * Supprime le message en vérifiant s’il peut (pour éviter les erreurs, on peut mettre un timeout aussi).
 * @param {Message} message - Le message à supprimer.
 * @param {number} [after = 0] - Le timemout (en ms).
 * @returns {void}
 */
function tryDeleteMessage(message, after = 0) {
	if (message.deletable) {
		message.delete({
			reason: 'Auto-suppression.',
			timeout: after,
		});
	}
}

/**
 * Envoie les messages nécéssaires en cas d'erreur de commande.
 * @param {CommandFail} fail - Les erreurs faîtes.
 * @param {module:"discord.js".Message} message - Le message pour récupérer la guild et le salon.
 * @param {Command} command - La commande pour les messages d'erreurs.
 * @returns {void}
 */
function processCommandFail(fail, message, command) {
	if (!fail.isFailed) return;

	if (fail.missingPermissions.client.length > 0) return permsError(message, command, fail.missingPermissions.client, true);
	else if (fail.missingPermissions.user.length > 0) return permsError(message, command, fail.missingPermissions.user);
	else if (fail.tags.includes(TAGS.DM_ONLY)) return argError(message, command, "Commande exécutée sur un serveur alors que la commande n'est autorisé qu'en privé.");
	else if (fail.tags.includes(TAGS.OWNER_ONLY)) return argError(message, command, 'Commande autorisée uniquement par les gérants du bot.');

	if (message.guild) {
		if (fail.tags.includes(TAGS.GUILD_OWNER_ONLY)) return argError(message, command, 'Commande autorisée uniquement par le propriétaire du serveur.');
		else if (fail.tags.includes(TAGS.NSFW_ONLY)) return argError(message, command, 'Commande autorisée uniquement sur les salons NSFW.');
	} else if (fail.tags.includes(TAGS.GUILD_ONLY)) return argError(message, command, "Commande exécutée en privé alors que la commande n'est autorisé que sur serveur.");

	if (fail.cooldown) {
		const {cooldown} = require('../events/message.js');
		const cooldownCommand = cooldown.get(message.author.id).find(c => c.command === command.name);

		message.channel?.send(`Veuillez attendre encore **${((cooldownCommand.releasingAt.getTime() - Date.now()) / 1000).toFixed(2)}** secondes pour ré-effectuer la commande.`);
	}
}

/**
 * Vérifie la commande.
 * Renvoie des erreurs si des permissions sont manquantes ou si les tags ne sont pas validés.
 * @param {Command} command - La commande où il y a eu l'erreur.
 * @param {Message} message - Le message Discord qui a provoqué l'erreur.
 * @returns {CommandFail} Le message d'erreur.
 */
function verifyCommand(command, message) {
	const missingPermissions = verifyPermissionsFromCommand(command, message);
	const {cooldown} = require('../events/message.js');
	/**
	 * @type CommandFail
	 */
	const fail = {
		cooldown: null,
		isFailed: false,
		missingPermissions,
		tags: [],
	};

	if (missingPermissions.client.length > 0 || missingPermissions.user.length > 0) fail.isFailed = true;

	if (cooldown.get(message.author.id)?.find(c => c.command === command.name)) {
		fail.isFailed = true;
		fail.cooldown = message.author.id;
	}

	if (command.tags.includes(TAGS.OWNER_ONLY) && !isOwner(message.author.id)) {
		fail.isFailed = true;
		fail.tags.push(TAGS.OWNER_ONLY);
	}

	if (message.guild) {
		if (command.tags.includes(TAGS.GUILD_OWNER_ONLY) && message.guild.owner.id !== message.author.id) {
			fail.isFailed = true;
			fail.tags.push(TAGS.GUILD_OWNER_ONLY);
		}

		if (command.tags.includes(TAGS.NSFW_ONLY) && !message.channel.nsfw) {
			fail.isFailed = true;
			fail.tags.push(TAGS.NSFW_ONLY);
		}

		if (command.tags.includes(TAGS.DM_ONLY)) {
			fail.isFailed = true;
			fail.tags.push(TAGS.DM_ONLY);
		}
	} else if (command.tags.includes(TAGS.GUILD_ONLY)) {
		fail.isFailed = true;
		fail.tags.push(TAGS.GUILD_ONLY);
	}

	return fail;
}

module.exports = {
	processCommandFail,
	tryDeleteMessage,
	verifyCommand,
};
