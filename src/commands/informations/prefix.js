const Command = require('../../entities/Command.js');
const {tags} = require('../../constants.js');

module.exports = class PrefixCommand extends Command {
	constructor() {
		super({
			name: 'prefix',
			aliases: ['prefixes', 'prefixe', 'préfix', 'préfixe'],
			description: 'Renvoie la liste des préfixes du bot.',
			tags: [tags.prefix_command],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const prefixes = process.env.IS_CANARY === 'true' ? process.env.CANARY_PREFIXES.split(', ') : process.env.PROD_PREFIXES.split(', ');
		prefixes.push(client.user.toString());

		await super.send(`Voici les préfixes du bot : \n\n${prefixes.join('\n')}`);
	}
};
