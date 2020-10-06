const {
	argError,
	permsError,
} = require('./Errors.js');
const {isOwner} = require('./Utils.js');
const {tags} = require('../constants.js');

/**
 * Renvoie les permissions menquantes d'une commande par rapport à un message (objets vide sinon).
 * @param {Command} command - La commande.
 * @param {Message} message - Le message.
 * @returns {MissingPermissions} - Le résultat, un objet avec 2 arrays contenant les permissions manquantes du membre et du cliebt (bot).
 */
function verifyPermissionsFromCommand(command, message) {
	const result = {
		client: [],
		user:   [],
	};
	
	if (!message.guild) {
		return result;
	}
	
	command.clientPermissions.forEach(value => {
		if (!message.channel.permissionsFor(message.guild.me).has(value, false)) {
			result.client.push(value);
		}
	});
	
	command.userPermissions.forEach(perm => {
		if (!message.channel.permissionsFor(message.member).has(perm, false)) {
			result.user.push(perm);
		}
	});
	
	return result;
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
			timeout: after,
			reason:  'Auto-suppression.',
		});
	}
}

/**
 * Envoie les messages nécéssaires en cas d'erreur de commande.
 * @param {CommandFail} fail - Les erreurs faites.
 * @param {module:"discord.js".Message} message - Le message pour récupérer la guild et le salon.
 * @param {Command} command - La commande pour les messages d'erreurs.
 * @retuns {void}
 */
function processCommandFail(fail, message, command) {
	if (!fail.isFailed) return;
	
	if (fail.missingPermissions.client.length > 0) {
		return permsError(message, command, fail.missingPermissions.client, true);
	} else if (fail.missingPermissions.user.length > 0) {
		return permsError(message, command, fail.missingPermissions.user);
	} else if (fail.tags.includes(tags.dm_only)) {
		return argError(message, command, 'Commande exécutée sur un serveur alors que la commande n\'est autorisé qu\'en privé.');
	} else if (fail.tags.includes(tags.owner_only)) {
		return argError(message, command, 'Commande autorisée uniquement par les gérants du bot.');
	}
	
	if (message.guild) {
		if (fail.tags.includes(tags.guild_owner_only)) {
			return argError(message, command, 'Commande autorisée uniquement par le propriétaire du serveur.');
		} else if (fail.tags.includes(tags.nsfw_only)) {
			return argError(message, command, 'Commande autorisée uniquement sur les salons NSFW.');
		}
	} else if (fail.tags.includes(tags.guild_only)) {
		return argError(message, command, 'Commande exécutée en privé alors que la commande n\'est autorisé que sur serveur.');
	}
	
	if (fail.cooldown) {
		const {cooldown} = require('../events/message.js');
		const cooldownCommand = cooldown.get(message.author.id).find(c => c.command === command.name);
		
		return message.channel?.send(`Veuillez attendre encore **${((cooldownCommand.releasingAt.getTime() - Date.now()) / 1000).toFixed(2)}** secondes pour ré-effectuer la commande.`);
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
	const fail = {
		missingPermissions: {
			user: missingPermissions.user,
			client: missingPermissions.client,
		},
		tags:               [],
		cooldown:           null,
		isFailed:           false,
	};
	
	if (missingPermissions.client.length > 0 || missingPermissions.user.length > 0) {
		fail.isFailed = true;
	}
	
	if (cooldown.get(message.author.id)?.find(c => c.command === command.name)) {
		fail.isFailed = true;
		fail.cooldown = message.author.id;
	}
	
	if (command.tags.includes(tags.owner_only) && !isOwner(message.author.id)) {
		fail.isFailed = true;
		fail.tags.push(tags.owner_only);
	}
	
	if (message.guild) {
		if (command.tags.includes(tags.guild_owner_only) && message.guild.owner.id !== message.author.id) {
			fail.isFailed = true;
			fail.tags.push(tags.guild_owner_only);
		}
		
		if (command.tags.includes(tags.nsfw_only) && !message.channel.nsfw) {
			fail.isFailed = true;
			fail.tags.push(tags.nsfw_only);
		}
		
		if (command.tags.includes(tags.dm_only)) {
			fail.isFailed = true;
			fail.tags.push(tags.dm_only);
		}
	} else if (command.tags.includes(tags.guild_only)) {
		fail.isFailed = true;
		fail.tags.push(tags.guild_only);
	}
	
	return fail;
}

module.exports = {
	processCommandFail,
	tryDeleteMessage,
	verifyCommand,
	verifyPermissionsFromCommand,
};
