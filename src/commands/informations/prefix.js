const Command = require('../../entities/Command.js');
const {getShortPrefix} = require('../../utils/Utils.js');
const {tags} = require('../../constants.js');

module.exports = class PrefixCommand extends Command {
	constructor() {
		super({
			aliases: ['prefixes', 'prefixe', 'préfix', 'préfixe'],
			description: 'Renvoie la liste des préfixes du bot.',
			name: 'prefix',
			tags: [tags.prefix_command],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const prefixes = getShortPrefix();
		prefixes.push(client.user.toString());

		await super.send(`Voici les préfixes du bot : \n\n${prefixes.join('\n')}`);
	}
};
