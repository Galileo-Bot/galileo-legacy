const MemeCommand = require('../../entities/custom_commands/MemeCommand.js');
const {tags} = require('../../constants.js');

module.exports = class BoyfriendCommand extends MemeCommand {
	constructor() {
		super({
			name: 'choix',
			description: 'Vous devez faire un choix.',
			usage: 'choix <Choix1> ; <Choix2>',
			aliases: ['sueur', 'choose'],
			tags: [tags.guild_only],
			templateID: '87743020',
			argsMaxLength: 25,
			argsNumber: 2,
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await super.processMeme(args, message);
	}
};
