const SanctionCommand = require('../../entities/custom_commands/SanctionCommand.js');
const {TAGS} = require('../../constants.js');

module.exports = class WarnCommand extends SanctionCommand {
	constructor() {
		super({
			description: "Permet d'ajouter un avertissement à un membre du serveur avec une raison.",
			name: 'warn',
			tags: [TAGS.GUILD_ONLY],
			type: 'warn',
			usage: 'warn <ID ou mention de membre> [raison]',
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
