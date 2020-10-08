const {MessageEmbed} = require('discord.js');
const {argError} = require('../../utils/Errors.js');
const Command = require('../../entities/Command.js');
const {channels} = require('../../constants.js');

module.exports = class SupportCommand extends Command {
	constructor() {
		super({
			name: 'support',
			description: "Permet de contacter le créateur sur une suggestion ou un problème..\n**Temps d'attente entre 2 commandes : 5 minutes.**",
			usage: 'contact <texte>',
			aliases: ['contact', 'report'],
			cooldown: 300,
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		if (args.length === 0) return argError(message, this, 'Veuillez mettre du texte.');
		const text = args.join(' ');

		const embed = new MessageEmbed();
		embed.setTimestamp();
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		embed.setAuthor(
			`${message.author.tag} (${message.author.id}) nous contacte pour :`,
			message.author.displayAvatarURL({
				dynamic: true,
				format: 'png',
			})
		);
		embed.setDescription(text);
		embed.setFooter(message.guild ? `Du serveur : ${message.guild.name} (${message.guild.id})` : 'Envoyé en messages privés.');
		if (message.attachments.array()[0]?.height) embed.setImage(message.attachments.array()[0].url);

		await client.channels.cache.get(channels.supportChannel).send(embed);
		await super.send(
			'<:smiley:635159054989262848> **Le message a été transmit à notre équipe.**\n<a:loada:635159061179924487> *Ils se chargeront de votre demande dans les plus brefs délais, __veuillez ouvrir vos mp car ils vous contacteront sûrement__.*'
		);
	}
};
