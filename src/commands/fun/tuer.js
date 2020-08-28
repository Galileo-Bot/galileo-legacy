const {argTypes} = require('../../constants.js');
const Command = require('../../entities/Command.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const {random, readJSON} = require('../../utils/Utils.js');


module.exports = class TuerCommand extends Command {
	constructor() {
		super({
			name: 'tuer',
			description: 'Permet de trouver une bonne façon de mourir pour vous ou une personne ou quelque chose.',
			usage: 'tuer [Mention de membre/Texte]',
			aliases: ['kill']
		});
	}
	
	async run(client, message, args) {
		await super.run(client, message, args);
		
		const {killMethods} = readJSON('./assets/jsons/commandConstants.json');
		const person = getArg(message, 1, argTypes.user) || args.join(' ') || message.author.username;
		let sentence;
		
		do {
			sentence = `${person} ${random(killMethods)} et meurt.`;
		} while (sentence.includes('undefined'));
		
		await super.send(sentence);
		tryDeleteMessage(message);
	}
};
