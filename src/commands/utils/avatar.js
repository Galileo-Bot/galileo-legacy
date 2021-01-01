const {argTypes} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const Command = require('../../entities/Command.js');
const {BetterEmbed} = require('discord.js-better-embed');

module.exports = class AvatarCommand extends Command {
	constructor() {
		super({
			aliases: ['av'],
			description: "Permet d'afficher l'avatar d'une personne grâce à son ID/Nom/Mention.",
			name: 'avatar',
			usage: 'avatar [ID/Nom/Mention]',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const person = getArg(message, 1, argTypes.user) ?? message.author;
		const link = person.displayAvatarURL({
			dynamic: true,
			format: 'png',
		});
		const embed = BetterEmbed.fromTemplate('image', {
			client,
			description: `<:link:539121207543595008> [Lien de l'avatar.](${link})`,
			image: link,
			title: `Avatar de ${person.username} :`,
		});
		embed.setColor('#0faf2f');

		await super.send(embed);
	}
};
