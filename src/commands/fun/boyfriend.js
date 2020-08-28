const MemeCommand = require('../../classes/MemeCommand.js');
const {tags} = require('../../constants.js');

module.exports = class BoyfriendCommand extends MemeCommand {
	constructor() {
		super({
			name:        'boyfriend',
			description: 'On dirait que ce petit ami est distrait.',
			usage:       'boyfriend <Texte femme> ; <Texte home> ; <Texte femme jalouse>',
			aliases:     ['retourné', 'bf'],
			tags:        [tags.guild_only],
			templateID:  '112126428',
			argsMaxLength: 30,
			argsNumber: 3,
		});
	}
	
	async run(client, message, args) {
		await super.run(client, message, args);
		await super.processMeme(args, message);
	}
};
