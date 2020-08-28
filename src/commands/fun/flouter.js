const ImageCommand = require('../../classes/ImageCommand.js');

module.exports = class FlouterCommand extends ImageCommand {
	constructor() {
		super({
			name: 'flouter',
			description: 'Permet de flouter votre avatar, la personne ou l\'image que vous avez attachée au message.',
			usage: 'flouter [Nom/Mention/ID d\'utilisateur]',
			aliases: ['flou']
		});
	}
	
	async run(client, message, args) {
		await super.run(client, message, args);
		await this.imageCommand(message, 'gaussian', 4);
	}
};
