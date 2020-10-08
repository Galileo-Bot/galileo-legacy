const Command = require('../../entities/Command.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const {argError} = require('../../utils/Errors.js');

module.exports = class SpamSpoilCommand extends Command {
	constructor() {
		super({
			name: 'spamspoil',
			description: 'Renvoie le texte avec 1 ||spoil|| par caractère.',
			usage: 'spamspoil <texte>',
			aliases: ['spoil', 'spoileriser', 'spam-spoil'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const text = args.join(' ');
		let finalText = '';

		if (args.length === 0) return argError(message, this, 'Veuillez mettre du texte.');

		for (let i = 0; i < text.length; i++) {
			finalText += `||${text.charAt(i)}||`;
		}

		await message.channel?.send(finalText, {
			split: {
				char: '|',
			},
		});

		tryDeleteMessage(message);
	}
};
