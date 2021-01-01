const MemeCommand = require('../../entities/custom_commands/MemeCommand.js');
const {tags} = require('../../constants.js');

module.exports = class BoyfriendCommand extends MemeCommand {
	constructor() {
		super({
			aliases: ['sueur', 'choose'],
			argsMaxLength: 25,
			argsNumber: 2,
			description: 'Vous devez faire un choix.',
			name: 'choix',
			tags: [tags.guild_only],
			templateID: '87743020',
			usage: 'choix <Choix1> ; <Choix2>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await super.processMeme(args, message);
	}
};
