const GuildEvent = require('../classes/GuildEvent.js');
const {sendLogMessage} = require('../utils/Utils.js');

module.exports = class GuildDeleteEvent extends GuildEvent {
	constructor() {
		super({
			name: 'guildCreate',
			type: 'remove'
		});
	}
	
	async run(client, guild) {
		await super.run(client, guild);
		super.log();
		sendLogMessage(client, 'removeGuild', super.embed());
	}
};
