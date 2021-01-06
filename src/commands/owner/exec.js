const SlowCommand = require('../../entities/custom_commands/SlowCommand.js');
const {TAGS} = require('../../constants.js');
const {sendJS} = require('./eval.js');
const {argError} = require('../../utils/Errors.js');
const {exec} = require('child_process');

module.exports = class ExecCommand extends SlowCommand {
	constructor() {
		super({
			aliases: ['execute', 'bash'],
			description: 'Exécute une commande bash.',
			name: 'exec',
			tags: [TAGS.OWNER_ONLY],
			usage: 'exec <command>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		if (!args) return argError(message, this, 'Veuillez mettre une commande à exécuter.');

		await this.startWait();
		exec(
			`@chcp 65001 & ${args.join(' ')}`,
			{
				cwd: process.cwd(),
				encoding: 'buffer',
			},
			async (error, stdout, stderr) => {
				await this.stopWait();

				if (error) {
					await message.react('❗');
					return sendJS(message.channel, `ERROR : \n\n${error.stack}`);
				}

				if (stdout.toString('utf8').length > 0) {
					await message.react('✔');
					sendJS(message.channel, `STDOUT : \n\n${stdout.toString('utf8')}`);
				}

				if (stderr.toString('utf8').length > 0) {
					await message.react('❗');
					sendJS(message.channel, `STDERR : \n\n${stderr.toString('utf8')}`);
				}
			}
		);
	}
};
