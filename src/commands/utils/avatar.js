const {MessageEmbed} = require('discord.js');
const {argTypes} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const Command = require('../../entities/Command.js');


module.exports = class AvatarCommand extends Command {
	constructor() {
		super({
			name: 'avatar',
			description: 'Permet d\'afficher l\'avatar d\'une personne grâce à son ID/Nom/Mention.',
			usage: 'avatar [ID/Nom/Mention]',
			aliases: ['av']
		});
	}
	
	async run(client, message, args) {
		super.run(client, message, args);

		
		
		const person = await getArg(message, 1, argTypes.user) || message.author;
		const embed = new MessageEmbed();
		embed.setTitle(`Avatar de ${person.username}`);
		embed.setDescription(`<:link:539121207543595008> [Lien de l'avatar.](${person.displayAvatarURL()})`);
		embed.setImage(person.displayAvatarURL());
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		embed.setColor('#0faf2f');
		embed.setTimestamp();
		
		await super.send(embed);
	}
};
