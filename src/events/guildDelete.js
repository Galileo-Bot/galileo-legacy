const GuildEvent = require('../entities/custom_events/GuildEvent.js');
const {sendLogMessage} = require('../utils/Utils.js');

module.exports = class GuildDeleteEvent extends GuildEvent {
	constructor() {
		super({
			name: 'guildDelete',
			type: 'remove',
		});
	}

	async run(client, guild) {
		super.owner = `<@${guild.ownerID}>`;
		await super.run(client, guild);
		await super.log();
		await sendLogMessage(client, 'removeGuild', super.embed);
	}
};
