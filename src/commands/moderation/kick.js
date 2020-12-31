const SanctionCommand = require('../../entities/custom_commands/SanctionCommand.js');
const {tags} = require('../../constants.js');

module.exports = class KickCommand extends SanctionCommand {
	constructor() {
		super({
			name: 'kick',
			tags: [tags.guild_only],
			description: "Permet d'éjecter un [membre] du serveur avec une <raison>.",
			usage: 'kick [ID ou mention de membre] <raison>',
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
			clientPermissions: ['KICK_MEMBERS'],
			type: 'kick',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		const person = super.getPerson(message);
		if (!person) return;

		const reason = await super.createSanction(person);
		await super.applySanction(person, reason);
	}
};
