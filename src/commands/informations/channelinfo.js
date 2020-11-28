const {argTypes} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {formatDate} = require('../../utils/FormatUtils.js');
const Command = require('../../entities/Command.js');
const Embed = require('../../utils/Embed.js');

module.exports = class ChannelInfoCommand extends Command {
	constructor() {
		super({
			name: 'channelinfo',
			description: "Permet d'avoir des informations sur un salon.",
			usage: 'channelinfo <ID/Nom/Mention de salon>\nchannelinfo',
			aliases: ['ci', 'channel-info', 'saloninfo'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const channel = getArg(message, 1, argTypes.channel) ?? message.channel;
		let topic = 'Aucun.';
		let type = 'Textuel';
		switch (channel.type) {
			case 'voice':
				type = 'Vocal';
				break;
			case 'category':
				type = 'Catégorie';
				break;
			case 'news':
				type = 'Annonces';
				break;
			case 'store':
				type = 'Shopping';
				break;
		}

		if (channel.topic?.length > 0) topic = channel.topic;

		const embed = Embed.fromTemplate('basic', {
			client,
		});
		embed.setAuthor(
			`Informations sur le salon : ${channel.name}`,
			message.guild.iconURL({
				dynamic: true,
			})
		);
		embed.setColor('#4b5afd');
		embed.addField('🆔 ID :', channel.id, true);
		embed.addField('<:textuel:635159053630308391> Nom :', channel.name, true);
		embed.addField('<:bnote:635163385645760523> Date de création :', formatDate('dd/MM/yyyy hh:mm', channel.createdAt), true);
		embed.addField('<:category:635159053298958366> Type de salon :', type, true);
		if (type === 'Textuel') embed.addField('<a:cecia:635159108080631854> Sujet :', topic, true);

		await super.send(embed);
	}
};
