const MemeCommand = require('../../entities/custom_commands/MemeCommand.js');
const {tags} = require('../../constants.js');

module.exports = class SlapCommand extends MemeCommand {
	constructor() {
		super({
			aliases: ['tarte', 'claque', 'slape'],
			argsMaxLength: 35,
			argsNumber: 2,
			description: 'Vous avez dit une grosse bêtise, en voici la conséquence, une bonne baffe.',
			name: 'slap',
			tags: [tags.guild_only],
			templateID: '438680',
			usage: 'slap <Texte Robin> ; <Texte Batman>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await super.processMeme(args, message);
	}
};
