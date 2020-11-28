const SlowCommand = require('../../classes/SlowCommand.js');
const Logger = require('../../utils/Logger.js');
const imgur = require('imgur');
const Embed = require('../../utils/Embed.js');
const {exec} = require('child_process');

module.exports = class CommandStatsCommand extends SlowCommand {
	constructor() {
		super({
			name: 'commandstats',
			description: "Permet d'avoir des statistiques sur le nombre de commandes utilisées par le bot durant les 30 derniers jours.",
			aliases: ['cs', 'sm', 'statsmessages'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		await super.startWait();
		try {
			exec('py assets/generateGraph.py');
			exec('python3 assets/generateGraph.py');
		} catch (ignored) {}

		imgur
			.uploadFile('./assets/images/graphMessages.png')
			.then(json => {
				const embed = Embed.fromTemplate('title', {
					client,
					image: json.data.link,
					title: "Statistiques sur l'utilisation du bot.",
				});

				super.send(embed);
				super.stopWait();
			})
			.catch(e => Logger.error(e.stack));
	}
};
