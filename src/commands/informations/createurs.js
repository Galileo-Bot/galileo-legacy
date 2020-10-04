const {MessageEmbed} = require('discord.js');
const {readJSON} = require('../../utils/Utils.js');
const Command = require('../../entities/Command.js');

module.exports = class CreateursCommand extends Command {
	constructor() {
		super({
			name: 'createurs',
			description: "Permet d'avoir des informations sur Ayfri et Antow, les développeurs et créateurs de Galileo.",
			aliases: ['ayfri', 'createur', 'créateurs', 'antow'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const {creators} = readJSON('./assets/jsons/commandConstants.json');
		const ayfri = client.users.resolve('386893236498857985');
		const antow = client.users.resolve('216214448203890688');
		const embed = new MessageEmbed();

		// Ayfri
		embed.setTitle('Informations sur Ayfri');
		embed.setColor('#4b5afd');
		embed.setThumbnail(ayfri.displayAvatarURL());
		embed.setDescription(creators.ayfri);
		await super.send(embed);

		// Antow
		embed.setTitle('Informations sur Antow');
		embed.setColor('#7289da');
		embed.setThumbnail(antow.displayAvatarURL());
		embed.setDescription(creators.antow);
		await super.send(embed);
	}
};
