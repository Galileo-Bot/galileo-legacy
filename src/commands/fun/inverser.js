const ImageCommand = require('../../entities/custom_commands/ImageCommand.js');

module.exports = class InverserCommand extends ImageCommand {
	constructor() {
		super({
			aliases: ['invert'],
			description: "Permet d'inverser votre avatar, la personne ou l'image que vous avez attachée au message.",
			name: 'inverser',
			usage: "inverser [Nom/Mention/ID d'utilisateur]",
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await this.imageCommand(message, 'flip', false, true);
	}
};
