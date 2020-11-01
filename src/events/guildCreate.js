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
		super.owner = await guild.members.fetch(guild.ownerID);
		await super.run(client, await guild.fetch());
		await super.log();
		await sendLogMessage(client, `addGuild`, super.embed());
	}
};
