const {MessageEmbed} = require('discord.js');
const imgur = require('imgur');
const Command = require('../../entities/Command.js');
const {exec} = require('child_process');

module.exports = class CommandStatsCommand extends Command {
	constructor() {
		super({
			name: 'commandstats',
			description: "Permet d'avoir des statistiques sur le nombre de commandes utilisées par le bot durant les 30 derniers jours.",
			aliases: ['cs', 'sm', 'statsmessages'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const waitEmoji = client.emojis.cache.get('638831506126536718');
		try {
			exec('py assets/generateGraph.py');
			exec('python3 assets/generateGraph.py');
		} catch (ignored) {}

		await message.react(waitEmoji);

		imgur
			.uploadFile('./assets/images/graphMessages.png')
			.then(json => {
				const embed = new MessageEmbed();
				embed.setFooter(client.user.username, client.user.displayAvatarURL());
				embed.setTitle("Statistiques sur l'utilisation du bot.");
				embed.setImage(json.data.link);
				embed.setColor('#4b5afd');
				embed.setTimestamp();

				super.send(embed);
				message.reactions.cache.find(reaction => reaction.emoji === waitEmoji).users.remove(message.client.user.id);
			})
			.catch(err => {
				if (err) console.error(err);
			});
	}
};
