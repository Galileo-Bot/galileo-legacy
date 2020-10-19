const {MessageEmbed} = require('discord.js');
const Command = require('../../entities/Command.js');
const {argTypes, channels} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');

module.exports = class BugsCommand extends Command {
	constructor() {
		super({
			name: 'bugs',
			description: "Permet d'avoir la liste des bugs existants ou des informations sur un bug.",
			aliases: ['bug', 'buglist', 'buginfo'],
			usage: "bugs [Numéro d'un bug]",
		});
	}

	/**
	 * Retourne un bug en le cherchant dans le salon des bugs.
	 * @param {number | null} bugNumber - Le numéro du bug.
	 * @param {module:"discord.js".Collection<string, module:"discord.js".Message>} messages - Les messages dans lesquels rechercher le bug.
	 * @param {module:"discord.js".MessageEmbed} embed - L'embed.
	 * @returns {string} - L'embed.
	 */
	getBugOrBugs(bugNumber, messages, embed) {
		let description;
		if (bugNumber) {
			const bug = messages.find(msg => msg.number === bugNumber);
			if (!bug) return this.getBugOrBugs(null, messages, embed);

			description = bug.content;
			embed.setTitle(`Informations sur le bug numéro ${bug.number}:`);
			embed.addField('Présent depuis : ', `${Math.round((Date.now() - bug.since.getTime()) / (1000 * 60 * 60 * 24))} jours.`);
		} else {
			embed.setTitle('Liste des bugs existants :');
			messages = messages.sort((a, b) => parseInt(a.number) - parseInt(b.number));
			description = messages.map(message => message.content).join('\n\n');
		}

		return description ?? "Aucun bug n'a été trouvé.";
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const bugNumber = getArg(message, 1, argTypes.number);
		const channelBugs = client.channels.cache.get(channels.bugChannel);
		const embed = new MessageEmbed();

		if (!client.channels.cache.has(channelBugs.id)) {
			return super.send("Le bot n'a pas le salon bugs dans ses salon, contactez un créateur pour en savoir plus.");
		}

		let messages = await channelBugs.messages.fetch();
		messages = messages
			.filter(m => m.content.includes('<:non:515670765820182528>'))
			.map(msg => ({
				content: msg.content,
				number: msg.content.replace(/.+[*]{0,2}g\.(\d+)[*]{0,2}/, '$1'),
				since: msg.createdAt,
			}));

		const description = this.getBugOrBugs(bugNumber, messages, embed);
		embed.setDescription(description);
		embed.setColor('#4b5afd');
		embed.setTimestamp();
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		await super.send(embed);
	}
};
