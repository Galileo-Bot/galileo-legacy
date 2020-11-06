const Command = require('../../entities/Command.js');
const {argError} = require('../../utils/Errors.js');

module.exports = class DevineCommand extends Command {
	constructor() {
		super({
			name: 'devine',
			description: 'Donne une réponse aux questions simples (oui/non), attention : non fiable à 100%.',
			usage: 'devine <texte> ?',
			aliases: ['dv', 'guess'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const {guess} = require('../../assets/jsons/constants.json');
		const fullText = args.join(' ');
		if (args.length === 0) return argError(message, this, '<a:attention:613714368647135245> **Veuillez mettre une question.**');
		if (fullText === '?') return argError(message, this, '<a:attention:613714368647135245> **Une question ne contient pas que un `?` :)**');
		if (!fullText.includes('?')) return argError(message, this, '<a:attention:613714368647135245> **Une question se termine par un `?`.**');

		return super.send(`**${message.author.username}**, ${guess[Math.floor(Math.random() * guess.length)]}`);
	}
};
