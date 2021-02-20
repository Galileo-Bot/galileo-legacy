const Command = require('../../entities/Command.js');
const {getShortPrefix} = require('../../utils/Utils.js');
const {TAGS} = require('../../constants.js');

module.exports = class PrefixCommand extends Command {
	constructor() {
		super({
			aliases: ['prefixes', 'préfix', 'préfixe'],
			description: 'Renvoie la liste des préfixes du bot.',
			name: 'prefix',
			tags: [TAGS.PREFIX_COMMAND],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const prefixes = getShortPrefix();
		prefixes.push(client.user.toString());

		await super.send(`Voici les préfixes du bot : \n\n${prefixes.join('\n')}`);
	}
};
