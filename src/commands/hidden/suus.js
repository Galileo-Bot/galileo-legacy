const {MessageEmbed} = require('discord.js');
const {random} = require('../../utils/Utils.js');
const Command = require('../../entities/Command.js');

module.exports = class SuusCommand extends Command {
	constructor() {
		super({
			name: 'suus',
			description: 'Jeej, jaaj. (affiche une image aléatoire de saucisse).',
			aliases: ['jeej', 'jaaj'],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const {sausages} = require('../../assets/jsons/constants.json');
		const embed = new MessageEmbed();
		embed.setTimestamp();
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		embed.setColor('#4b5afd');
		embed.setDescription('Suus, jeej, jaaj.');
		embed.setImage(Math.floor(Math.random() * 1000) === 666 ? 'https://cdn.discordapp.com/attachments/537627694788116490/547067318409363479/SPOILER_31Bx6VLvAqL.png' : random(sausages));

		await super.send(embed);
	}
};
