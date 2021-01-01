const SanctionCommand = require('../../entities/custom_commands/SanctionCommand.js');
const {tags} = require('../../constants.js');

module.exports = class KickCommand extends SanctionCommand {
	constructor() {
		super({
			clientPermissions: ['KICK_MEMBERS'],
			description: "Permet d'éjecter un [membre] du serveur avec une <raison>.",
			name: 'kick',
			tags: [tags.guild_only],
			type: 'kick',
			usage: 'kick [ID ou mention de membre] <raison>',
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
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
