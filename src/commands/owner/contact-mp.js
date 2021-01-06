const {ARG_TYPES, TAGS} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');
const Command = require('../../entities/Command.js');

module.exports = class ContactMpCommand extends Command {
	constructor() {
		super({
			aliases: ['mp', 'contactmp'],
			description: "Permet d'envoyer un message en privé à un utilisateur.",
			name: 'contact-mp',
			tags: [TAGS.OWNER_ONLY],
			usage: "contact-mp <ID/Nom/Mention d'utilisateur> <texte>",
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const person = getArg(message, 1, ARG_TYPES.USER);
		if (!person) return argError(message, this, 'Veuillez préciser une personne avec son ID/Mention/Nom.');
		args.splice(0, 1);

		const text = args.join(' ');
		if (text?.length === 0) return argError(message, this, 'Veuillez mettre du texte.');

		await person.send(text, {
			files: message.attachments.array(),
		});

		await super.send(`<a:valid:638509756188983296> Message bien envoyé en privé à ${person}.`);
	}
};
