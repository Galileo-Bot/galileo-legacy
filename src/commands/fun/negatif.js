const ImageCommand = require('../../entities/custom_commands/ImageCommand.js');

module.exports = class NegatifCommand extends ImageCommand {
	constructor() {
		super({
			name: 'negatif',
			description: "Permet de rendre en négatif votre avatar, la personne ou l'image que vous avez attachée au message.",
			usage: "negatif [Nom/Mention/ID d'utilisateur]",
			aliases: ['négatif', 'negative'],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await this.imageCommand(message, 'invert');
	}
};
