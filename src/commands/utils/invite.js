const {MessageEmbed} = require('discord.js');
const Command = require('../../entities/Command.js');

module.exports = class InviteCommand extends (
	Command
) {
	constructor() {
		super({
			name: 'invite',
			description: "Permet d'avoir le lien d'invitation du bot.",
			aliases: ['inviter', 'iv'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const embed = new MessageEmbed();
		embed.setTimestamp();
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		embed.setAuthor(
			"🔗 Voici le lien d'invitation pour inviter le bot",
			`${message.author.displayAvatarURL({
				dynamic: true,
				format: 'png',
			})}`
		);
		embed.addField('<:botlogo:638859267771727882> Lien pour inviter le bot : ', "[**Lien d'invitation**](https://discordbots.org/bot/534087346472091648)");
		embed.addField('<:richtext:635163364875698215> Site web du bot : ', '[**Galileo Bot**](https://www.galileo-bot.tk/)');
		embed.addField('<:bug:635159047284195328> Nous vous invitons à rejoindre le support : ', '[**Serveur de Support**](https://discord.gg/3xYWhcu)');
		embed.addField('<:github:780092164314497067> Si vous trouvez un bug sur le bot : ', '[**Repo GitHub de Support**](https://github.com/Galileo-Bot/issues)');
		embed.setColor('#1d13db');

		await super.send(embed);
	}
};
