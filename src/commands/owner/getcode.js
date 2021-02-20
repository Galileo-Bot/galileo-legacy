const {readFileSync, existsSync} = require('fs');
const {ARG_TYPES, TAGS} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const Command = require('../../entities/Command.js');
const {argError} = require('../../utils/Errors.js');
const {join, sep} = require('path');

module.exports = class GetCodeCommand extends Command {
	constructor() {
		super({
			aliases: ['gc'],
			description: "Renvoie le code entier d'une commande.",
			name: 'getcode',
			tags: [TAGS.OWNER_ONLY],
			usage: 'getcode <commande>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const command = getArg(message, 1, ARG_TYPES.COMMAND);
		if (command) {
			await this.sendFileCode(message, join('commands', command.category, `${command.name}.js`));
		} else {
			existsSync(args.join(' '))
				? await this.sendFileCode(message, args.join(' '))
				: argError(message, this, `Fichier \`${process.cwd() + sep + args.join(' ')}\` non trouvé.`);
		}
	}

	async sendFileCode(message, path) {
		await this.send(`\`\`\`js\n${readFileSync(path, 'utf8')}\`\`\``, {
			split: {
				append: '```',
				maxLength: 1990,
				prepend: '```js\n',
			},
		});
	}
};
