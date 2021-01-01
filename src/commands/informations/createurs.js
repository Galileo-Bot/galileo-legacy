const {BetterEmbed} = require('discord.js-better-embed');
const Command = require('../../entities/Command.js');

module.exports = class CreateursCommand extends Command {
	constructor() {
		super({
			aliases: ['ayfri', 'createur', 'créateurs', 'antow'],
			description: "Permet d'avoir des informations sur Ayfri et Antow, les développeurs et créateurs de Galileo.",
			name: 'createurs',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const {creators} = require('../../assets/jsons/data.json');
		const ayfri = client.users.resolve('386893236498857985');
		const antow = client.users.resolve('216214448203890688');

		await this.sendCreator(ayfri, creators.ayfri);
		await this.sendCreator(antow, creators.antow);
	}

	async sendCreator(user, creator) {
		const embed = new BetterEmbed();
		embed.setTitle(`Informations sur ${user.username} :`);
		embed.setColor('#4b5afd');
		embed.setThumbnail(user.displayAvatarURL());
		embed.setDescription(creator);
		await super.send(embed);
	}
};
