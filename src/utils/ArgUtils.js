const {Message} = require('discord.js');
const {getPrefixFromMessage} = require('./Utils.js');
const {ARG_TYPES} = require('../constants.js');
const CommandManager = require('../entities/CommandManager.js');
const {getTime} = require('./FormatUtils.js');
const {client} = require('../main.js');

// todo: refaire les systèmes message.mentions.truc[0] car rangé par l'API et pas forcément le contenu

/**
 * Donne les arguments depuis un message.
 * @param {Message} message - Le message.
 * @returns {string[]} - Les arguments du message.
 */
function getArgListFromMessage(message) {
	return message.content.slice(getPrefixFromMessage(message).length).trim().split(/\s+/g) || [];
}

/**
 * Permet de récupérer un argument avec un contenu (il vaut mieux utiliser {@link getArg}).
 * @param {string} content - Le contenu.
 * @param {ARG_TYPES} argType - Le type d'argument.
 * @returns {any} - L'argument reçu.
 */
function getArgWithContent(content, argType) {
	let result;
	if (!content || typeof content !== 'string') return null;

	switch (argType) {
		case ARG_TYPES.COMMAND:
			result = CommandManager.findCommand(content);
			break;

		case ARG_TYPES.NUMBER:
			result = Number.isNaN(Number.parseFloat(content)) ? null : Number.parseFloat(content);
			break;

		case ARG_TYPES.STRING:
			result = content.toString();
			break;

		case ARG_TYPES.CHANNEL_ID:
			result = client.channels.resolve(content);
			break;

		case ARG_TYPES.CHANNEL_NAME:
			result = client.channels.cache.filter(channel => !channel.deleted && 'name' in channel).find(channel => channel.name?.toLowerCase().includes(content.toLowerCase()));
			break;

		case ARG_TYPES.GUILD_ID:
			result = client.guilds.resolve(content);
			break;

		case ARG_TYPES.GUILD_NAME:
			result = client.guilds.cache.find(guild => guild.name.toLowerCase().includes(content.toLowerCase()));
			break;

		case ARG_TYPES.DURATION:
			result = getTime(content);
			break;

		case ARG_TYPES.USER_ID:
			result = client.users.resolve(content);
			break;

		case ARG_TYPES.USER_USERNAME:
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
 * @param {Message} message - Le message.
 * @param {ARG_TYPES} argType - Type d'argument.
 * @param {number} [index = 1] - Index pour ensuite faire les tests sur l'argument [index].
 * @returns {any} L'argument suivant son type.
 */
function getArgWithMessage(message, argType, index = 1) {
	const arg = getArgListFromMessage(message)[index];

	let result;
	switch (argType) {
		case ARG_TYPES.MEMBER:
			if (message.mentions.members.size > 0 ?? message.mentions.users.size > 0) {
				result = message.mentions.members.array()[index - 1] || message.mentions.users.array()[index - 1];
			} else if (arg) {
				result = message.guild.members.cache.find(
					m => m.user.id === arg || m.user.username.toLowerCase().includes(arg?.toLowerCase()) || m.nickname?.toLowerCase().includes(arg?.toLowerCase())
				);
			}

			break;

		case ARG_TYPES.USER:
			result =
				message.mentions.users.size > 0
					? message.mentions.users.array()[index - 1]
					: getArgWithContent(arg, ARG_TYPES.USER_USERNAME) ?? getArgWithContent(arg, ARG_TYPES.USER_ID);
			break;

		case ARG_TYPES.GUILD:
			result = getArgWithContent(arg, ARG_TYPES.GUILD_ID) ?? getArgWithContent(arg, ARG_TYPES.GUILD_NAME);
			break;

		case ARG_TYPES.ROLE:
			result = message.guild.roles.cache.find(r => r.id === arg || r.name.toLowerCase().includes(arg?.toLowerCase()));
			break;

		case ARG_TYPES.CHANNEL:
			result =
				message.mentions.channels.size > 0
					? message.mentions.channels.array()[index - 1]
					: getArgWithContent(arg, ARG_TYPES.CHANNEL_ID) ?? getArgWithContent(arg, ARG_TYPES.CHANNEL_NAME);
			break;

		default:
			result = null;
			break;
	}

	if (result === null) result = getArgWithContent(arg, argType);

	return result;
}

/**
 * Récupère l'argument à l'index indiqué et le vérifie, si la vérification est mauvaise, le résultat sera égal à null.
 * @example
 * const arg1 = getArg("bite", 0, ARG_TYPES.NUMBER);
 * console.log(arg1); // 'null' car "bite" ne contient pas de nombre à la première place.
 * @example
 * // (message = g/help)
 * const arg2 = getArg(message, 0, ARG_TYPES.COMMAND);
 * console.log(arg2); // 'help'
 * @example
 * const arg3 = getArg("g/avatar Ayfri", 1, ARG_TYPES.USER_USERNAME);
 * console.log(arg3); // 'Ayfri'
 *
 * @param {Message | string} content - Contenu.
 * @param {number} index - L'index, arg[0] avant est égal à l'index 1 !
 * @param {ARG_TYPES | string} argType - Type d'argument.
 * @returns {module:"discord.js".GuildMember | module:"discord.js".User | module:"discord.js".Role | module:"discord.js".Snowflake | Command | string | number | null} - Le résultat.
 */
function getArg(content, index, argType) {
	return content instanceof Message ? getArgWithMessage(content, argType, index) : getArgWithContent(content, argType);
}

module.exports = {
	getArg,
};
