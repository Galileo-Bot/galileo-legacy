const {ARG_TYPES, TAGS} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');
const Command = require('../../entities/Command.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');

module.exports = class ClearCommand extends Command {
	constructor() {
		super({
			aliases: ['supprimer', 'purge', 'clr', 'delete'],
			clientPermissions: ['MANAGE_MESSAGES'],
			description: 'Permet de supprimer un nombre de messages.',
			name: 'clear',
			tags: [TAGS.GUILD_ONLY],
			usage: 'clear <Nombre>\nclear <Nombre> [Nom/ID/Mention de membre]',
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const person = args.length === 1 ? null : getArg(message, 1, ARG_TYPES.USER) ?? getArg(message, 2, ARG_TYPES.USER);
		/**
		 * @type {number}
		 */
		let nbr = getArg(message, 1, ARG_TYPES.NUMBER) ?? getArg(message, 2, ARG_TYPES.NUMBER);

		if (!nbr) return argError(message, this, 'Veuillez mettre un nombre.');
		if (nbr < 1) return argError(message, this, 'Veuillez mettre un nombre entre 1 et 100.');
		nbr++;

		if (person) {
			(await message.channel.messages.fetch())
				.filter(m => m.author.id === person.id)
				.array()
				.slice(0, nbr)
				.forEach(m => tryDeleteMessage(m));
		} else {
			try {
				while (nbr > 100) {
					await message.channel.bulkDelete(100);
					nbr -= 100;
				}
				await message.channel.bulkDelete(nbr);
			} catch (error) {
				if (error.message.includes('You can only bulk delete messages that are under 14 days old')) return;
			}
		}

		const m = await super.send(`<a:valid:638509756188983296> **${nbr - 1}** messages${person ? ` de ${person}` : ''} ont bien été supprimés.`);
		tryDeleteMessage(message);
		tryDeleteMessage(m, 6000);
	}
};
