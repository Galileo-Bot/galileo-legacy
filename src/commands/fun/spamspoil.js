const Command = require('../../entities/Command.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const {argError} = require('../../utils/Errors.js');

module.exports = class SpamSpoilCommand extends Command {
	constructor() {
		super({
			aliases: ['spoil', 'spoileriser', 'spam-spoil'],
			description: "Renvoie le texte avec 1 ||spoil|| par caractère, rajoutez `--copier` pour pouvoir récupérer le texte et l'envoyer n'importe où.",
			name: 'spamspoil',
			usage: 'spamspoil <texte>\nspamspoil -copier <text>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		let text = args.join(' ');
		let finalText = '';

		if (/[^\\]?-?-copier\s*/g.test(message.content)) text = text.replace(/-?-copier\s*/g, '');
		if (args.length === 0) return argError(message, this, 'Veuillez mettre du texte.');

		for (let i = 0; i < text.length; i++) {
			finalText += `||${text.charAt(i)}||`;
		}

		if (/[^\\]?-?-copier\s*/g.test(message.content)) finalText = `\`${finalText}\``;

		await super.send(finalText, {
			split: {
				char: '|',
			},
		});

		tryDeleteMessage(message);
	}
};
