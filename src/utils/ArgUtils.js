const {GuildChannel, Message} = require('discord.js');
const {getPrefixFromMessage} = require('./Utils.js');
const {argTypes} = require('../constants.js');
const CommandManager = require('../entities/CommandManager.js');
const {client} = require('../main.js');

/**
 * Donne les arguments depuis un message.
 * @param {module:"discord.js".Message} message - Le message.
 * @returns {string[]} - Les arguments du message.
 */
function getArgListFromMessage(message) {
	return message.content.slice(getPrefixFromMessage(message).length).trim().split(/\s+/g) ?? [];
}

/**
 * Permet de récupérer un argument avec un contenu (il vaut mieux utiliser {@link getArg}).
 * @param {string} content - Le contenu.
 * @param {string} argType - Le type d'argument.
 * @returns {any} - L'argument reçu.
 */
function getArgWithContent(content, argType) {
	let result;
	if (!content || typeof content !== 'string') return null;

	switch (argType) {
		case argTypes.command:
			result = CommandManager.commands.find(c => c.name.toLowerCase() === content.toLowerCase() || c.aliases?.map(c => c.toLowerCase())?.includes(content.toLowerCase()));
			break;

		case argTypes.number:
			result = Number.isNaN(Number(content)) ? null : Number(content);
			break;

		case argTypes.string:
			result = content.toString() === content;
			break;

		case argTypes.channel_id:
			result = client.channels.cache.get(content);
			break;

		case argTypes.channel_name:
			result = client.channels.cache.filter(channel => !channel.deleted && channel instanceof GuildChannel).find(channel => channel.name?.toLowerCase().includes(content.toLowerCase()));
			break;

		case argTypes.guild_id:
			result = client.guilds.cache.get(content);
			break;

		case argTypes.guild_name:
			result = client.guilds.cache.find(guild => guild.name.toLowerCase().includes(content.toLowerCase()));
			break;

		case argTypes.user_id:
			result = client.users.cache.get(content);
			break;

		case argTypes.user_username:
			result = client.users.cache.find(user => user.username.toLowerCase().includes(content.toLowerCase()));
			break;

		default:
			result = null;
			break;
	}

	return result;
}

/**
 * Permet de récupérer un argument avec le message (il vaut mieux utiliser {@link getArg}).
 * @param {module:"discord.js".Message} message - Le message.
 * @param {argTypes} argType - Type d'argument.
 * @param {number} [index = 1] - Index pour ensuite faire les tests sur l'argument [index].
 * @returns {any} L'argument suivant son type.
 */
function getArgWithMessage(message, argType, index = 1) {
	const firstArg = getArgListFromMessage(message)[index];

	let result;
	switch (argType) {
		case argTypes.member:
			if (message.mentions.members.size > 0 || message.mentions.users.size > 0) {
				result = message.mentions.members.array()[index - 1] || message.mentions.users.array()[index - 1]; // todo: refaire ce système car c'est rangé par l'API et pas le contenu (look doc)
			} else if (firstArg) {
				result = message.guild.members.cache.find(
					m => m.user.id === firstArg || m.user.username.toLowerCase().includes(firstArg?.toLowerCase()) || m.nickname?.toLowerCase().includes(firstArg?.toLowerCase())
				);
			}

			break;

		case argTypes.user:
			if (message.mentions.users.size > 0) {
				result = message.mentions.users.array()[index - 1]; // todo: refaire ce système car c'est rangé par l'API et pas le contenu (look doc)
			} else {
				result = getArgWithContent(firstArg, argTypes.user_username) || getArgWithContent(firstArg, argTypes.user_id);
			}
			break;

		case argTypes.guild:
			result = getArgWithContent(firstArg, argTypes.guild_id) || getArgWithContent(firstArg, argTypes.guild_name);
			break;

		case argTypes.role:
			result = message.guild.roles.cache.find(r => r.id === firstArg || r.name.toLowerCase().includes(firstArg?.toLowerCase()));
			break;

		case argTypes.channel:
			if (message.mentions.channels.size > 0) {
				result = message.mentions.channels.array()[index - 1]; // todo refaire parce que...
			} else {
				result = getArgWithContent(firstArg, argTypes.channel_id) || getArgWithContent(firstArg, argTypes.channel_name);
			}

			break;

		case argTypes.command:
			result = getArgWithContent(firstArg, argTypes.command);
			break;

		case argTypes.number:
			result = getArgWithContent(firstArg, argTypes.number);
			break;

		case argTypes.string:
			result = getArgWithContent(firstArg, argTypes.string);
			break;

		default:
			result = null;
			break;
	}

	return result;
}
/**
 * Récupère l'argument à l'index indiqué et le vérifie, si la vérification est mauvaise, le résultat sera égal à null.
 * @example
 * const arg1 = getArg("bite", 0, argTypes.number);
 * console.log(arg1); // 'null' car "bite" ne contient pas de nombre à la première place.
 * @example
 * // (message = g/help)
 * const arg2 = getArg(message, 0, argTypes.command);
 * console.log(arg2); // 'help'
 * @example
 * const arg3 = getArg("g/avatar Ayfri", 1, argTypes.user_username);
 * console.log(arg3); // 'Ayfri'
 *
 * @param {module:"discord.js".Message|string} content - Contenu.
 * @param {number} index - L'index, arg[0] avant est égal à l'index 1 !
 * @param {argTypes|string} argType - Type d'argument.
 * @returns {module:"discord.js".User | module:"discord.js".Snowflake | Command | string | number | null} - Le résultat.
 */
function getArg(content, index, argType) {
	return content instanceof Message ? getArgWithMessage(content, argType, index) : getArgWithContent(content, argType);
}

module.exports = {
	getArg,
	getArgWithContent,
};
