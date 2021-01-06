const {exec} = require('child_process');
const {TAGS} = require('../../constants.js');
const Logger = require('../../utils/Logger.js');
const Command = require('../../entities/Command.js');

module.exports = class RebootCommand extends Command {
	constructor() {
		super({
			aliases: ['rb', 'restart'],
			description: "Permet de relancer le bot, de l'arrêter complètement ou de le passer en maintenance.",
			name: 'reboot',
			tags: [TAGS.OWNER_ONLY],
			usage: 'reboot\nreboot stop\nreboot maintenance',
		});
	}

	exit(status, stopProcess = true) {
		this.client.dbManager.cache.set('status', status);
		this.client.dbManager.cache.set('rebootingChannel', this.message.guild ? this.message.channel.id : this.message.author.id);

		if (stopProcess) setTimeout(() => process.exit(0), 1000 * 4);
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		if (args[0] === 'maintenance') {
			await super.send('Mise en maintenance du bot en cours.');
			Logger.info(` : Mise en maintenance du bot en cours. (relancement pour les applications, demandé par ${message.author.tag})`, 'RebootCommand');
			this.exit('maintenance');

			return;
		}

		if (args[0] === 'stop') {
			await super.send('Arrêt du bot en cours.');
			Logger.info(`Arrêt du bot en cours. (demandé par ${message.author.tag})`, 'RebootCommand');
			this.exit('stopped', false);

			setTimeout(() => {
				try {
					exec(`pm2 stop ${global[Object.getOwnPropertySymbols(global)[1]]?.initialConfig?.module_name}`);
				} catch (ignored) {
				} finally {
					process.exit(0);
				}
			}, 1000 * 4);
			return;
		}

		await super.send('Relancement du bot en cours.');

		Logger.info(`Relancement du bot en cours. (demandé par ${message.author.tag}`, 'RebootCommand');
		this.exit('reboot');
	}
};
