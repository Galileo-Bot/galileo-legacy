const Command = require('../../entities/Command.js');
const {BetterEmbed} = require('discord.js-better-embed');

module.exports = class InviteCommand extends Command {
	constructor() {
		super({
			aliases: ['inviter', 'iv'],
			description: "Permet d'avoir le lien d'invitation du bot.",
			name: 'invite',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const embed = BetterEmbed.fromTemplate('basic', {
			client,
		});
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
