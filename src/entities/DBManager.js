const Logger = require('../utils/Logger.js');
const Enmap = require('enmap');

module.exports = class DBManager {
	messages;
	ready;
	userInfos;

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
	}

	prepareDB() {
		this.userInfos.defer
			.then(() => {
				Logger.log('Base de données UserInfos prête.', 'DBManager');

				this.messages.defer
					.then(() => {
						Logger.log('Base de données Messages prête.', 'DBManager');

						Logger.info('Les bases de données sont prêtes !', 'DBManager');
					})
					.catch(e => Logger.error(e, 'DBManager'));
			})
			.catch(e => Logger.error(e, 'DBManager'));
	}
};
