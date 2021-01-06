const MemeCommand = require('../../entities/custom_commands/MemeCommand.js');
const {TAGS} = require('../../constants.js');

module.exports = class BoyfriendCommand extends MemeCommand {
	constructor() {
		super({
			aliases: ['retourné', 'bf'],
			argsMaxLength: 30,
			argsNumber: 3,
			description: 'On dirait que ce petit ami est distrait.',
			name: 'boyfriend',
			tags: [TAGS.GUILD_ONLY],
			templateID: '112126428',
			usage: 'boyfriend <Texte femme> ; <Texte home> ; <Texte femme jalouse>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await super.processMeme(args, message);
	}
};
