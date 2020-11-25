const {tags} = require('../../constants.js');
const Command = require('../../entities/Command.js');

module.exports = class CoupleCommand extends (
	Command
) {
	constructor() {
		super({
			name: 'couple',
			description: "Permet de vous lier en couple avec quelqu'un !",
			usage: 'couple <Nom/Mention de Personne> <Nom/Mention de personne>\ncouple <Nom/Mention de personne>\ncouple random\ncouple',
			aliases: ['love'],
			tags: [tags.guild_only],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const personOne = args[0] ? args[0] ?? message.mentions.members.first() : args[0] === 'random' ? message.guild.members.cache.random().displayName : message.member.displayName;
		const personTwo = args[1] ? args[1] ?? message.mentions.members.array()[1] : message.guild.members.cache.random().displayName;
		const percentage = Math.abs(
			Math.round(((((personOne.charCodeAt(0) * 102.4 + personTwo.charCodeAt(0) * 52.5) * personOne.length * Math.abs(Math.cos(personTwo.length) * 18.5)) / new Date().getDate()) * 26.2) / 56.2)
		);

		await super.send(`**${personOne}** a porté son amour sur **${personTwo}**. :gift_heart:
${personOne === personTwo || personOne.toString() === personTwo.toString() ? 'Il est donc narcissique à' : 'Ses chances de réussites pour conclure sont de'} **${percentage
			.toString()
			.slice(2, 4)}**% !`);
	}
};
