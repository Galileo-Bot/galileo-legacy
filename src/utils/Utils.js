/**
 * Récupère le préfixe du message par rapport à la config.
 * @param {Message} message - Le message.
 * @returns {null|string} - Return null s’il trouve rien, sinon String.
 */
function getPrefixFromMessage(message) {
	let prefix = null;
	const possiblePrefixes = process.env.IS_CANARY === 'true' ? process.env.CANARY_PREFIXES.split(', ') : process.env.PROD_PREFIXES.split(', ');
	possiblePrefixes.push(message.client.user.toString());
	possiblePrefixes.push(`<@!${message.client.user.id}>`);

	for (const possiblePrefix of possiblePrefixes) {
		if (message.content.startsWith(possiblePrefix)) prefix = possiblePrefix;
	}

	return prefix;
}

/**
 * Indique si l'id l'user est owner.
 * @param {string} userId - Id à tester.
 * @returns {boolean} - Si il est owner.
 */
function isOwner(userId) {
	return process.env.OWNERS.split(', ').includes(userId);
}

/**
 * Retourne la clé via la propriété de l'objet.
 * @param {object} object - L'object.
 * @param {any} value - La valeur.
 * @returns {string} - La clé.
 */
function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

/**
 * Retourne une valeur aléatoire de l'array mis en argument.
 * @param {any[]} array - Un tableau.
 * @returns {*} - Une des valeurs random.
 */
function random(array) {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * Permet d'envoyer un message de log sur le serveur de gali.
 * @param {GaliClient | Client} client - Le client pour récupérer les salons etc.
 * @param {'addGuild' | 'bug' | 'command' | 'mp' | 'removeGuild' | 'rateLimit'} channelType - Type de salon.
 * @param {BetterEmbed | string} content - Le contenu.
 * @returns {void}
 */
async function sendLogMessage(client, channelType, content) {
	const {channels} = require('../constants.js');
	if (process.env.IS_CANARY === 'true') {
		/**
		 * @type {TextChannel}
		 */
		const channel = await client.channels.fetch(channels.canaryChannels[channelType]);
		if (channel) await channel.send(content);
	} else {
		/**
		 * @type {TextChannel}
		 */
		const channel = await client.channels.fetch(channels.galiChannels[channelType]);
		if (channel) {
			await channel.send(content);

			if (['addGuild', 'removeGuild'].includes(channelType)) {
				const addOrRemoveChannel = await client.channels.fetch(channels.addOrRemoveChannel);
				await addOrRemoveChannel.send(content);
			}
		}
	}
}

function getShortPrefix() {
	return process.env.IS_CANARY === 'true' ? process.env.CANARY_PREFIXES.split(', ')[0] : process.env.PROD_PREFIXES.split(', ')[0];
}

module.exports = {
	getKeyByValue,
	getPrefixFromMessage,
	getShortPrefix,
	isOwner,
	random,
	sendLogMessage,
};
