const ImageCommand = require('../../entities/custom_commands/ImageCommand.js');

module.exports = class NegativeCommand extends ImageCommand {
	constructor() {
		super({
			aliases: ['négatif', 'negative'],
			description: "Permet de rendre en négatif votre avatar, la personne ou l'image que vous avez attachée au message.",
			name: 'negatif',
			usage: "negatif [Nom/Mention/ID d'utilisateur]",
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await this.imageCommand(message, 'invert');
	}
};
