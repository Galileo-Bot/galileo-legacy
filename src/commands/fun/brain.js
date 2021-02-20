const MemeCommand = require('../../entities/custom_commands/MemeCommand.js');
const {TAGS} = require('../../constants.js');

module.exports = class BrainCommand extends MemeCommand {
	constructor() {
		super({
			aliases: ['wtf', 'intelligent'],
			argsMaxLength: 55,
			argsNumber: 4,
			description: 'Vous êtes absorbés par la connaissance.',
			font: 'verdana',
			name: 'brain',
			tags: [TAGS.GUILD_ONLY],
			templateID: '93895088',
			usage: 'brain <Quelque chose> ; <Quelque chose de bien> ; <Quelque chose incroyable> ; <TRUC DE MALADE>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await super.processMeme(args, message);
	}
};
