const Logger = require('../utils/Logger.js');
const Enmap = require('enmap');

module.exports = class DBManager {
	messages;
	ready;
	userInfos;
	cache;

	constructor() {
		this.userInfos = new Enmap({
			name: 'userinfos',
			fetchAll: true,
			autoFetch: true,
			dataDir: './assets/db',
		});

		this.messages = new Enmap({
			name: 'messages',
			fetchAll: true,
			autoFetch: true,
			dataDir: './assets/db',
		});

		this.cache = new Enmap({
			name: 'cache',
			fetchAll: true,
			autoFetch: true,
			dataDir: './assets/db',
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
		} catch (e) {
			Logger.error(e.stack, 'DBManager');
		}
	}
};
