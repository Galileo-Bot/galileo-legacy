const MemeCommand = require('../../entities/custom_commands/MemeCommand.js');
const {TAGS} = require('../../constants.js');

module.exports = class BoyfriendCommand extends MemeCommand {
	constructor() {
		super({
			aliases: ['sueur', 'choose'],
			argsMaxLength: 30,
			argsNumber: 2,
			description: 'Vous devez faire un choix.',
			name: 'choix',
			tags: [TAGS.GUILD_ONLY],
			templateID: '87743020',
			usage: 'choix <Choix1> ; <Choix2>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await super.processMeme(args, message);
	}
};
