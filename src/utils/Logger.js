const {formatDate} = require('./FormatUtils.js');
const {logTypes} = require('../constants.js');
const {getKeyByValue} = require('./Utils.js');

module.exports = class Logger {
	/**
	 * Log un message de débug (magenta).
	 * @param {any} message - Message à log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static debug(message, title = '') {
		Logger.process(message, logTypes.debug, title);
	}

	/**
	 * Log un message d'erreur (rouge).
	 * @param {any} message - Message à log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static error(message, title = '') {
		Logger.process(message, logTypes.error, title);
	}

	/**
	 * Log un message d'info (blue).
	 * @param {any} message - Message à log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static info(message, title = '') {
		Logger.process(message, logTypes.info, title);
	}

	/**
	 * Log un message (white).
	 * @param {any} message - Message à log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static log(message, title = '') {
		Logger.process(message, logTypes.log, title);
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
		function addSquareBrackets(string) {
			return `[${string}]`;
		}

		let result = `\x1b[${type}m${formatDate('[yyyy-MM-jj hh:mm:ss.SSSS]')}${addSquareBrackets(getKeyByValue(logTypes, type).toUpperCase())}`;
		if (title) result += addSquareBrackets(title);
		result += ` ${String(message)}\x1b[39;0m`;

		console.log(result);
	}

	/**
	 * Log un message de warn (yellow).
	 * @param {any} message - Message à log.
	 * @param {string} [title = ''] - Titre du log.
	 */
	static warn(message, title = '') {
		Logger.process(message, logTypes.warn, title);
	}
};
