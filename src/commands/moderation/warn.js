const SanctionCommand = require('../../classes/SanctionCommand.js');
const {tags} = require('../../constants.js');

module.exports = class WarnCommand extends SanctionCommand {
	constructor() {
		super({
			name: 'warn',
			description: 'Permet d\'ajouter un avertissement à un membre du serveur avec une raison.',
			usage: 'warn <ID ou mention de membre> [raison]',
			tags: [tags.guild_only],
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
			type: 'warn'
		});
	}
	
	async run(client, message, args) {
		await super.run(client, message, args);
		const person = super.getPerson(message);
		if(!person) return;
		
		const reason = await super.createSanction(person);
		await super.applySanction(person, reason);
	}
};
