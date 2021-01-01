const ImageCommand = require('../../entities/custom_commands/ImageCommand.js');

module.exports = class GriserCommand extends ImageCommand {
	constructor() {
		super({
			description: "Permet de rendre en noir et blanc votre avatar, la personne ou l'image que vous avez attachée au message.",
			name: 'griser',
			usage: "griser [Nom/Mention/ID d'utilisateur]",
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await this.imageCommand(message, 'greyscale');
	}
};
