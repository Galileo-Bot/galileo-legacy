const ImageCommand = require('../../entities/custom_commands/ImageCommand.js');

module.exports = class SepiaCommand extends ImageCommand {
	constructor() {
		super({
			aliases: ['sépia'],
			description: "Permet de rendre en sépia votre avatar, la personne ou l'image que vous avez attachée au message.",
			name: 'sepia',
			usage: "sepia [Nom/Mention/ID d'utilisateur]",
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await this.imageCommand(message, 'sepia');
	}
};
