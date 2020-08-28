const {argTypes} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const {argError} = require('../../utils/Errors.js');
const {isOwner} = require('../../utils/Utils.js');
const Command = require('../../entities/Command.js');


module.exports = class DireCommand extends Command {
	constructor() {
		super({
			name: 'dire',
			description: 'Permet de faire dire au bot le texte de votre choix.',
			usage: 'dire <texte>',
			aliases: ['say'],
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_MESSAGES']
		});
	}
	
	async run(client, message, args) {
		await super.run(client, message, args);
		
		const channelID = getArg(message, 1, argTypes.channel);
		let channel = message.channel;
		
		if (isOwner(message.author.id) && channelID) {
			args.shift();
			channel = channelID;
		}
		
		const text = args.join(' ');
		text.length > 0 ? await channel.send(text) : argError(message, this, 'Veuillez mettre du texte.');
		
		tryDeleteMessage(message);
	}
};
