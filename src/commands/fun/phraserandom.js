const {random} = require('../../utils/Utils.js');
const Command = require('../../entities/Command.js');

module.exports = class PhraseRandomCommand extends Command {
	constructor() {
		super({
			name: 'phraserandom',
			description: 'Vous renvoie une phrase générée aléatoirement et en général drôle =)',
			aliases: ['phrase-random', 'phrase', 'pr'],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const {phrase} = require('../../assets/jsons/data.json');

		function setFirstLetterUpper(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		}

		function addSentence() {
			const subject = random(phrase.subjects);
			const thing = random(phrase.things);
			const action = random(phrase.actions);
			const other = random(phrase.others);
			let result = `${action} ${thing}${other}\n`;
			result = Math.random() > 0.4 ? `Vous ${result}` : `${subject} ${result}`;

			return result;
		}

		let sentence = addSentence() + addSentence();

		do {
			sentence = sentence
				.replace(/{randomMember}/, message.guild ? setFirstLetterUpper(message.guild.members.cache.random().displayName) : setFirstLetterUpper(random(phrase.things)))
				.replace(/{randomRange\((\d+), (\d+)\)}/, (str, firstNumber, secondNumber) => Math.floor(Math.random() * (secondNumber - firstNumber) + Number(firstNumber)).toString());
		} while (sentence.match(/{random(Member|Range)}/g));

		await super.send(sentence);
	}
};
