const {MessageEmbed} = require('discord.js');
const Command = require('../../entities/Command.js');

module.exports = class CreateursCommand extends (
	Command
) {
	constructor() {
		super({
			name: 'createurs',
			description: "Permet d'avoir des informations sur Ayfri et Antow, les développeurs et créateurs de Galileo.",
			aliases: ['ayfri', 'createur', 'créateurs', 'antow'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const {creators} = require('../../assets/jsons/constants.json');
		const ayfri = client.users.resolve('386893236498857985');
		const antow = client.users.resolve('216214448203890688');

		await this.sendCreator(ayfri, creators.ayfri);
		await this.sendCreator(antow, creators.antow);
	}

	async sendCreator(user, creator) {
		const embed = new MessageEmbed();
		embed.setTitle(`Informations sur ${user.username} :`);
		embed.setColor('#4b5afd');
		embed.setThumbnail(user.displayAvatarURL());
		embed.setDescription(creator);
		await super.send(embed);
	}
};
