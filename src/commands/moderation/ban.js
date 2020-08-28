const SanctionCommand = require('../../classes/SanctionCommand.js');
const {tags} = require('../../constants.js');

module.exports = class BanCommand extends SanctionCommand {
	constructor() {
		super({
			name: 'ban',
			description: 'Permet de bannir un membre du serveur définitivement avec potentiellement une raison.',
			usage: 'ban <ID/Nom/Mention d\'un membre> [raison]',
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
			clientPermissions: ['BAN_MEMBERS'],
			tags: [tags.guild_only],
			type: 'ban'
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
