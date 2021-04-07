const dayjs = require('dayjs');
const {LOG_TYPES} = require('../constants.js');
const {getKeyByValue} = require('./Utils.js');

module.exports = class Logger {
	/**
	 * Log un message de débug (magenta).
	 * @param {any} message - Message à log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static debug(message, title = '') {
		Logger.process(message, LOG_TYPES.DEBUG, title);
	}

	/**
	 * Log un message d'erreur (rouge).
	 * @param {any} message - Message à log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static error(message, title = '') {
		Logger.process(message, LOG_TYPES.ERROR, title);
	}

	/**
	 * Log un message d'info (blue).
	 * @param {any} message - Message à log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static info(message, title = '') {
		Logger.process(message, LOG_TYPES.INFO, title);
	}

	/**
	 * Log un message (white).
	 * @param {any} message - Message à log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static log(message, title = '') {
		Logger.process(message, LOG_TYPES.LOG, title);
	}

	/**
	 * Process le message pour le log suivant les arguments.
	 * @example
	 * process("messsage", logsTypes.log, "Titre");
	 * // logging : [2020-05-22 01:37:40.0151][LOG][Titre] message
	 *
	 * @param {string} message - Message à log.
	 * @param {string} type - Type de log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static process(message, type, title = '') {
		function addBrackets(string) {
			return `[${string}]`;
		}

		let result = `\x1b[${type}m${addBrackets(dayjs().format('YYYY-MM-DD hh:mm:ss.SSS'))}${addBrackets(getKeyByValue(LOG_TYPES, type).toUpperCase())}`;
		if (title) result += addBrackets(title);
		result += ` ${String(message)}\x1b[39;0m`;

		console.log(result);
	}

	/**
	 * Log un message de warn (yellow).
	 * @param {any} message - Message à log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static warn(message, title = '') {
		Logger.process(message, LOG_TYPES.WARN, title);
	}
};
