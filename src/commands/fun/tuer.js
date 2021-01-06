const {ARG_TYPES} = require('../../constants.js');
const Command = require('../../entities/Command.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const {random} = require('../../utils/Utils.js');

module.exports = class TuerCommand extends Command {
	constructor() {
		super({
			aliases: ['kill'],
			description: 'Permet de trouver une bonne façon de mourir pour vous ou une personne ou quelque chose.',
			name: 'tuer',
			usage: 'tuer [Mention de membre/Texte]',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const {killMethods} = require('../../assets/jsons/data.json');
		const person = getArg(message, 1, ARG_TYPES.USER) || args.join(' ') || message.author.username;
		let sentence;

		do {
			sentence = `${person} ${random(killMethods)} et meurt.`;
		} while (sentence.includes('undefined'));

		await super.send(sentence);
		tryDeleteMessage(message);
	}
};
