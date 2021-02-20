const Command = require('../../entities/Command.js');
const {BetterEmbed} = require('discord.js-better-embed');
const {ARG_TYPES, CHANNELS} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');

module.exports = class BugsCommand extends Command {
	constructor() {
		super({
			aliases: ['bug', 'buglist', 'buginfo'],
			description: "Permet d'avoir la liste des bugs existants ou des informations sur un bug.",
			name: 'bugs',
			usage: "bugs [Numéro d'un bug]",
		});
	}

	/**
	 * Retourne un bug en le cherchant dans le salon des bugs.
	 * @param {number | null} bugNumber - Le numéro du bug.
	 * @param {{number: number, content: string, since: Date}[]} messages - Les messages dans lesquels rechercher le bug.
	 * @param {BetterEmbed} embed - L'embed.
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
			messages = messages.sort((a, b) => a.number - b.number);
			description = messages.map(message => message.content).join('\n\n');
		}

		return description ?? "Aucun bug n'a été trouvé.";
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const bugNumber = getArg(message, 1, ARG_TYPES.NUMBER);
		/**
		 * @type {module:"discord.js".TextChannel}
		 */
		const channelBugs = client.channels.cache.get(CHANNELS.BUG_CHANNEL);
		if (!client.channels.cache.has(channelBugs.id)) {
			return super.send(
				"Le salon contenant la liste des bugs n'a pas été trouvé par le bot, ceci n'étant pas normal, merci de contacter un créateur si vous voulez régler ceci."
			);
		}

		const messages = (await channelBugs.messages.fetch())
			.filter(m => m.content.includes('<:non:515670765820182528>'))
			.map(msg => ({
				content: msg.content,
				number: parseInt(msg.content.replace(/.+[*]{0,2}g\.(\d+)[*]{0,2}/, '$1')),
				since: msg.createdAt,
			}));

		const embed = BetterEmbed.fromTemplate('complete', {
			client,
		});
		const description = this.getBugOrBugs(bugNumber, messages, embed);
		embed.setDescription(description);
		await super.send(embed);
	}
};
