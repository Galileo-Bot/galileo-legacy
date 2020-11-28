const {argTypes} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const Command = require('../../entities/Command.js');
const Embed = require('../../utils/Embed.js');

module.exports = class AvatarCommand extends Command {
	constructor() {
		super({
			name: 'avatar',
			description: "Permet d'afficher l'avatar d'une personne grâce à son ID/Nom/Mention.",
			usage: 'avatar [ID/Nom/Mention]',
			aliases: ['av'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const person = getArg(message, 1, argTypes.user) ?? message.author;
		const link = person.displayAvatarURL({
			dynamic: true,
			format: 'png',
		});
		const embed = Embed.fromTemplate('image', {
			client,
			title: `Avatar de ${person.username} :`,
			description: `<:link:539121207543595008> [Lien de l'avatar.](${link})`,
			image: link,
		});
		embed.setColor('#0faf2f');

		await super.send(embed);
	}
};
