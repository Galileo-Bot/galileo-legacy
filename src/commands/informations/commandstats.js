const SlowCommand = require('../../entities/custom_commands/SlowCommand.js');
const {BetterEmbed} = require('discord.js-better-embed');
const {exec} = require('child_process');

module.exports = class CommandStatsCommand extends SlowCommand {
	constructor() {
		super({
			aliases: ['cs', 'sm', 'statsmessages'],
			description: "Permet d'avoir des statistiques sur le nombre de commandes utilisées par le bot durant les 30 derniers jours.",
			name: 'commandstats',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		await super.startWait();
		try {
			exec('py assets/generateGraph.py');
			exec('python3 assets/generateGraph.py');
		} catch (ignored) {}

		const embed = BetterEmbed.fromTemplate('title', {
			client,
			title: "Statistiques sur l'utilisation du bot.",
		});

		embed.setImageFromFile('./assets/images/graphMessages.png');
		await super.send(embed);
		await super.stopWait();
	}
};
