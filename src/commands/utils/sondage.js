const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const {argError} = require('../../utils/Errors.js');
const Command = require('../../entities/Command.js');
const Embed = require('../../utils/Embed.js');

module.exports = class SondageCommand extends Command {
	constructor() {
		super({
			name: 'sondage',
			description: 'Permet de faire des sondages avec un nombre de choix personnalisé, si vous attachez une image à la commande, elle sera affiché sur le sondage.',
			usage: 'sondage <Question> ; [choix1] ; [choix2] ; [choix3] etc...\n sondage <Question>',
			aliases: ['vote', 'poll'],
			clientPermissions: ['ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		let image = null;
		let description = '';
		const text = args.join(' ');
		const emotes = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'keycap_ten'];
		const question = `**${text.slice(0, text.indexOf(' ; ')).toString()}**\n\n`;
		const embed = Embed.fromTemplate('author', {
			client,
			author: `Question de ${message.author.tag} :`,
			authorURL: message.author.displayAvatarURL({
				dynamic: true,
			}),
		});

		if (question === '****\n\n') return argError(message, this, 'Veuillez mettre une question.');
		if (message.attachments.size > 0 && message.attachments.first().height) image = message.attachments.first().url;

		const choices = text.substring(text.length + 2, question.length - 3).split(` ; `);
		if (image) embed.setImage(image);

		if (choices.length === 1) {
			embed.setDescription(choices[0].length === 0 ? args.join(' ') : `${question}> ${choices[0]}`);

			const m = await super.send(embed);
			await m.react('✅');
			await m.react('❌');
			return;
		}

		if (choices.length > 11) return argError(message, this, 'Le maximum de choix possibles est 10.');
		choices.forEach((choice, index) => {
			description += `:${emotes[index]}: : ${choice}\n`;
		});

		embed.setDescription(question + description);

		const m = await super.send(embed);
		for (let i = 0; i < choices.length; i++) {
			const emoji = client.guilds.cache.get('561646328317476866').emojis.cache.find(e => e.name === emotes[i]);
			await m.react(emoji);
		}

		tryDeleteMessage(message);
	}
};
