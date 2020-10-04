const GuildEvent = require('../classes/GuildEvent.js');
const {sendLogMessage} = require('../utils/Utils.js');

module.exports = class GuildCreateEvent extends GuildEvent {
	constructor() {
		super({
			name: 'guildCreate',
			type: 'add',
		});
	}

	async run(client, guild) {
		await super.run(client, guild);
		super.log();
		sendLogMessage(client, `addGuild`, super.embed());
	}
};
