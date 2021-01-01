const ImageCommand = require('../../entities/custom_commands/ImageCommand.js');

module.exports = class FlouterCommand extends ImageCommand {
	constructor() {
		super({
			aliases: ['flou'],
			description: "Permet de flouter votre avatar, la personne ou l'image que vous avez attachée au message.",
			name: 'flouter',
			usage: "flouter [Nom/Mention/ID d'utilisateur]",
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await this.imageCommand(message, 'gaussian', 4);
	}
};
