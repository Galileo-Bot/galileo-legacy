const {argTypes, tags} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');
const Command = require('../../entities/Command.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');

module.exports = class ClearCommand extends Command {
	constructor() {
		super({
			name: 'clear',
			description: 'Permet de supprimer un nombre de messages.',
			usage: 'clear <Nombre> [Nom/ID/Mention de membre]',
			aliases: ['supprimer', 'purge', 'clr', 'delete'],
			userPermissions: ['KICK_MEMBERS', 'BAN_MEMBERS'],
			clientPermissions: ['MANAGE_MESSAGES'],
			tags: [tags.guild_only],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const person = getArg(message, 2, argTypes.member);
		let nbr = getArg(message, 1, argTypes.number);

		if (!nbr) return argError(message, this, 'Veuillez mettre un nombre.');
		if (nbr < 1) return argError(message, this, 'Veuillez mettre un nombre entre 1 et 100.');
		nbr++;

		if (person) {
			const messages = await message.channel.messages.fetch();
			nbr = messages.filter(m => m.author.id === person.id).length;
		}

		try {
			while (nbr > 100) {
				await message.channel.bulkDelete(100);
				nbr -= 100;
			}
			await message.channel.bulkDelete(nbr);
		} catch (error) {
			if (error.message.includes('You can only bulk delete messages that are under 14 days old')) return;
		}

		const m = await super.send(`<a:valid:638509756188983296> **${nbr - 1}** messages ont bien été supprimés.`);
		tryDeleteMessage(message);
		tryDeleteMessage(m, 5000);
	}
};
