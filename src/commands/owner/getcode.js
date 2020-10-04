const {readFileSync, existsSync} = require('fs');
const {argTypes, tags} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const Command = require('../../entities/Command.js');
const {argError} = require('../../utils/Errors.js');
const {join} = require('path');

module.exports = class GetCodeCommand extends Command {
	constructor() {
		super({
			name: 'getcode',
			description: "Renvoie le code entier d'une commande.",
			usage: 'getcode <commande>',
			aliases: ['gc'],
			tags: [tags.owner_only],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const command = getArg(message, 1, argTypes.command);
		if (command) {
			await this.sendFileCode(message, join('commands', command.category, `${command.name}.js`));
		} else if (existsSync(args.join(' '))) {
			return this.sendFileCode(message, args.join(' '));
		} else {
			return argError(message, this, `Fichier \`${process.cwd()}/${args.join(' ')}\` non trouvé.`);
		}
	}

	async sendFileCode(message, path) {
		await message.channel.send(`\`\`\`js\n${this.getFileCode(path)}\`\`\``, {
			split: {
				maxLength: 1990,
				prepend: `\`\`\`js\n`,
				append: `\`\`\``,
			},
		});
	}

	getFileCode(path) {
		return readFileSync(path);
	}
};
