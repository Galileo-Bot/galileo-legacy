const ImageCommand = require('../../entities/custom_commands/ImageCommand.js');

module.exports = class SepiaCommand extends ImageCommand {
	constructor() {
		super({
			name: 'sepia',
			description: "Permet de rendre en sépia votre avatar, la personne ou l'image que vous avez attachée au message.",
			usage: "sepia [Nom/Mention/ID d'utilisateur]",
			aliases: ['sépia'],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await this.imageCommand(message, 'sepia');
	}
};
