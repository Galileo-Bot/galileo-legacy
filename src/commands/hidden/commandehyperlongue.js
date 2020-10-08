const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const Command = require('../../entities/Command.js');

module.exports = class CommandeHyperLongueCommand extends Command {
	constructor() {
		super({
			name: 'commandehyperlongue',
			description: "GG t'as trouvé cette commande cachée x)",
			aliases: ['mdr', 'caché'],
			cooldown: 69,
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		await this.send(`Wesh comment t'as trouvé ça ??? ${message.author}`);
		tryDeleteMessage(message);
	}
};
