const {ARG_TYPES} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const {argError} = require('../../utils/Errors.js');
const {isOwner} = require('../../utils/Utils.js');
const Command = require('../../entities/Command.js');

module.exports = class DireCommand extends Command {
	constructor() {
		super({
			aliases: ['say'],
			description: 'Permet de faire dire au bot le texte de votre choix.',
			name: 'dire',
			usage: 'dire <texte>',
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_MESSAGES'],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		/**
		 * @type {Snowflake | null}
		 */
		const channelArg = getArg(message, 1, ARG_TYPES.CHANNEL_ID);
		const resolvedChannel = client.channels.resolve(channelArg);
		let channel = message.channel;

		if (isOwner(message.author.id) && !!resolvedChannel && channel.name) {
			await args.shift();
			channel = resolvedChannel;
		}

		const text = args.join(' ');
		text.length > 0 ? await channel.send(text) : argError(message, this, resolvedChannel ? "Veuillez mettre un texte en plus de l'ID du salon." : 'Veuillez mettre du texte.');

		tryDeleteMessage(message);
	}
};
