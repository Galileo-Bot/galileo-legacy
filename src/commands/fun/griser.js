const ImageCommand = require('../../classes/ImageCommand.js');

module.exports = class GriserCommand extends ImageCommand {
	constructor() {
		super({
			name: 'griser',
			description: 'Permet de rendre en noir et blanc votre avatar, la personne ou l\'image que vous avez attachée au message.',
			usage: 'griser [Nom/Mention/ID d\'utilisateur]'
		});
	}
	
	async run(client, message, args) {
		await super.run(client, message, args);
		await this.imageCommand(message, 'greyscale');
	}
};
