const SlowCommand = require('../../classes/SlowCommand.js');
const {tags} = require('../../constants.js');
const {sendJS} = require('./eval.js');
const {argError} = require('../../utils/Errors.js');
const {exec} = require('child_process');

module.exports = class ExecCommand extends SlowCommand {
	constructor() {
		super({
			name:        'exec',
			description: 'Exécute une commande bash.',
			usage:       'exec <command>',
			aliases:     ['execute', 'bash'],
			tags:        [tags.owner_only],
		});
	}
	
	async run(client, message, args) {
		await super.run(client, message, args);
		
		if (!args) {
			return argError(message, this, 'Veuillez mettre une commande à exécuter.');
		}
		
		await this.startWait();
		exec(`@chcp 65001 & ${args.join(' ')}`, {
			cwd:      process.cwd(),
			encoding: 'UTF-8',
		}, async (error, stdout, stderr) => {
			await this.stopWait();
			
			if (error) {
				await message.react('❗');
				return sendJS(message.channel, `ERROR : \n\n${error.stack}`);
			}
			
			if (stdout) {
				await message.react('✔');
				sendJS(message.channel, `STDOUT : \n\n${stdout}`);
			}
			
			if (stderr) {
				await message.react('❗');
				sendJS(message.channel, `STDERR : \n\n${stderr}`);
			}
		});
	}
};
