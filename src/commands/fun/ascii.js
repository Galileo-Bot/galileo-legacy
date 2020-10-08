const figlet = require('figlet');
const Command = require('../../entities/Command.js');
const {argError} = require('../../utils/Errors.js');

module.exports = class AsciiCommand extends Command {
	constructor() {
		super({
			name: 'ascii',
			description: 'Transforme votre message en un message ASCII, commande limitée à 20 caractères.',
			usage: 'ascii <Votre Message>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		if (args.join(' ').length > 20) return message.reply('<a:attention:613714368647135245> **Votre messages est trop long !**');
		figlet.text(args.join(' '), (err, data) => {
			if (data.trim().length === 0) return argError(message, this, '<a:attention:613714368647135245> **Veuillez mettre du texte.**');

			if (err) message.reply('<a:attention:613714368647135245> **Une erreur a eu lieu durant la génération...**');
			else super.send(`\`\`\`${data}\`\`\``);
		});
	}
};
