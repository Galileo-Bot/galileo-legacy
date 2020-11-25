const MemeCommand = require('../../classes/MemeCommand.js');
const {tags} = require('../../constants.js');

module.exports = class SlapCommand extends (
	MemeCommand
) {
	constructor() {
		super({
			name: 'slap',
			description: 'Vous avez dit une grosse bêtise, en voici la conséquence, une bonne baffe.',
			usage: 'slap <Texte Robin> ; <Texte Batman>',
			aliases: ['tarte', 'claque', 'slape'],
			tags: [tags.guild_only],
			templateID: '438680',
			argsMaxLength: 35,
			argsNumber: 2,
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await super.processMeme(args, message);
	}
};
