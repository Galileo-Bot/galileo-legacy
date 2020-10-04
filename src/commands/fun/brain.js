const MemeCommand = require('../../classes/MemeCommand.js');
const {tags} = require('../../constants.js');

module.exports = class BrainCommand extends MemeCommand {
	constructor() {
		super({
			name: 'brain',
			description: 'Vous êtes absorbés par la connaissance.',
			usage: 'brain <Quelque chose> ; <Quelque chose de bien> ; <Quelque chose incroyable> ; <TRUC DE MALADE>',
			aliases: ['wtf', 'intelligent'],
			tags: [tags.guild_only],
			templateID: '93895088',
			argsMaxLength: 50,
			argsNumber: 4,
			font: 'verdana',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await super.processMeme(args, message);
	}
};
