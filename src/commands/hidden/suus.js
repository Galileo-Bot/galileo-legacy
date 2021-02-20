const {random} = require('../../utils/Utils.js');
const Command = require('../../entities/Command.js');
const {BetterEmbed} = require('discord.js-better-embed');

module.exports = class SuusCommand extends Command {
	constructor() {
		super({
			aliases: ['jeej', 'jaaj'],
			description: 'Jeej, jaaj. (affiche une image aléatoire de saucisse).',
			name: 'suus',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const {sausages} = require('../../assets/jsons/data.json');
		const embed = BetterEmbed.fromTemplate('image', {
			client: this.client,
			description: 'Suus, jeej, jaaj.',
			image:
				Math.floor(Math.random() * 1000) === 666
					? 'https://cdn.discordapp.com/attachments/537627694788116490/547067318409363479/SPOILER_31Bx6VLvAqL.png'
					: random(sausages),
			title: 'Voici votre image de saucisse.',
		});

		await super.send(embed);
	}
};
