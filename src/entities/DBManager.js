const Logger = require('../utils/Logger.js');
const Enmap = require('enmap');

/**
 * @type {import("../../index.d.ts").DBManager}
 */
class DBManager {
	cache;
	messages;
	ready = false;
	userInfos;

	constructor() {
		this.userInfos = new Enmap({
			autoFetch: true,
			dataDir: './assets/db',
			fetchAll: true,
			name: 'userinfos',
		});

		this.messages = new Enmap({
			autoFetch: true,
			dataDir: './assets/db',
			fetchAll: true,
			name: 'messages',
		});

		this.cache = new Enmap({
			autoFetch: true,
			dataDir: './assets/db',
			fetchAll: true,
			name: 'cache',
		});
	}

	async prepare() {
		try {
			await this.cache.defer;
			Logger.log('Base de données Cache prête.', 'DBManager');
			await this.userInfos.defer;
			Logger.log('Base de données UserInfos prête.', 'DBManager');
			await this.messages.defer;
			Logger.log('Base de données Messages prête.', 'DBManager');
			Logger.info('Les bases de données sont prêtes !', 'DBManager');
			this.ready = true;
		} catch (e) {
			Logger.error(e.stack, 'DBManager');
		}
	}
}

module.exports = DBManager;
