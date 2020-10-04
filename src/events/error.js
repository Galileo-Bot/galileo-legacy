const Logger = require('../utils/Logger.js');
const Event = require('../entities/Event.js');

module.exports = class ErrorEvent extends Event {
	constructor() {
		super({
			name: 'error',
		});
	}

	async run(client) {
		await super.run(client);
		Logger.error('Bot déconnecté.', 'ErrorEvent');
	}
};
