const Logger = require('./Logger.js');
const fs = require('fs');
const {TextChannel} = require('discord.js');
const {channels} = require('../constants.js');
const {owners, prefixes} = require('../assets/jsons/config.json');


/**
 * Récupère le préfixe du message par rapport à la config.
 * @param {Message} message - Le message.
 * @returns {null|String} - Return null si il trouve rien, sinon String.
 */
function getPrefixFromMessage(message) {
	const {isCanary} = require('../main.js');
	let prefix = null;
	const possiblePrefixes = isCanary ? prefixes.canary : prefixes.prod;
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
	return owners.includes(userId);
}

/**
 * Retourne la clé via la propriété de l'objet.
 * @param {Object} object - L'object.
 * @param {any} value - La valeur.
 * @returns {string} - La clé.
 */
function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

/**
 * Sauvegarde un objet dans un JSON.
 * @param {string} path - Chemin du JSON.
 * @param {Object} content - Contenu du JSON.
 */
function writeInJSON(path, content) {
	if(!fs.existsSync(path)) {
		return Logger.warn(`Tentative d'écriture dans le fichier '${path}', le fichier n'a pas été trouvé.`, 'WriteInJSON');
	}
	
	if (content.size === 0 || JSON.stringify(content, null, 4).length === 0) {
		return Logger.warn(`L'objet que vous avez essayé de sauvegarder dans $ {path} a un problème et est vide. Le processus a été abandonné.`, 'WriteInJSON');
	}
	
	fs.writeFile(path, JSON.stringify(content, null, 4), err => {
		if (err) return Error(`Erreur sur l'enregistrement du fichier !\n${err}`);
	});
}

/**
 * Lis un JSON via son chemin (require n'existe plus).
 * @param {string} path - Le chemin du fichier.
 * @returns {Object|Array} Un JSON.
 */
function readJSON(path) {
	const bufferedData = fs.readFileSync(path);
	return JSON.parse(bufferedData.toString('utf8'));
}

/**
 * Retourne une valeur aléatoire de l'array mis en argument.
 * @param {Array} array - Un tableau.
 * @returns {*} - Une des valeurs random.
 */
function random(array) {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * Permet d'envoyer un message de log sur le serveur de gali.
 * @param {GaliClient|Client} client - Le client pour récupérer les salons etc.
 * @param {'addGuild'|'bug'|'command'|'mp'|'removeGuild'} channelType - Type de salon.
 * @param {string | module:"discord.js".StringResolvable | Embed | module:"discord.js".MessageAttachment} content - Le contenu.
 */
function sendLogMessage(client, channelType, content) {
	if (client.user.id === '579003487237570561') {
		const channel = client.channels.cache.get(channels.canaryChannels[channelType]);
		if (channel && channel instanceof TextChannel) channel.send(content);
	} else {
		const channel = client.channels.cache.get(channels.galiChannels[channelType]);
		if (channel && channel instanceof TextChannel) channel.send(content);
		
		if (channelType === 'addGuild' || channelType === 'removeGuild') {
			const addOrRemoveChannel = client.channels.cache.get(channels.addOrRemoveChannel);
			if (channel && channel instanceof TextChannel) addOrRemoveChannel.send(content);
		}
	}
}

module.exports = {
	getKeyByValue,
	getPrefixFromMessage,
	isOwner,
	random,
	readJSON,
	sendLogMessage,
	writeInJSON
};
