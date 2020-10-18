const Command = require('../../entities/Command.js');
const {isCanary} = require('../../main.js');
const {tags} = require('../../constants.js');
const {readJSON} = require('../../utils/Utils.js');

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

		let {prefixes} = readJSON('./assets/jsons/config.json');
		prefixes = isCanary ? prefixes.canary : prefixes.prod;

		prefixes.push(client.user.toString());

		await super.send(`Voici les préfixes du bot : \n\n${prefixes.join('\n')}`);
	}
};
