const {random} = require('../../utils/Utils.js');
const Command = require('../../entities/Command.js');

module.exports = class PhraseRandomCommand extends Command {
	constructor() {
		super({
			aliases: ['phrase-random', 'phrase', 'pr'],
			description: 'Renvoie une phrase générée aléatoirement et en général drôle <:smart_guy:547576698833600522>',
			name: 'phraserandom',
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
				.replace(/{randomRange\((?<first>\d+), ?(?<second>\d+)\)}/, (str, firstNumber, secondNumber) =>
					Math.floor(Math.random() * (secondNumber - firstNumber) + Number(firstNumber)).toString()
				);
		} while (/{random(?:Member|Range)}/g.match(sentence));

		await super.send(sentence);
	}
};
