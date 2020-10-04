const {MessageEmbed} = require('discord.js');
const {tags} = require('../../constants.js');
const Command = require('../../entities/Command.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');

module.exports = class EmotePackCommand extends Command {
	constructor() {
		super({
			name: 'emotepack',
			description: "Permet d'ajouter des émojis à votre serveur.",
			userPermissions: ['ADMINISTRATOR'],
			clientPermissions: ['MANAGE_EMOJIS'],
			tags: [tags.guild_only],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const emojis = {
			kappa: 'https://i.imgur.com/3PTNCVo.png',
			approuve: 'https://i.imgur.com/em00Asq.png',
			ping: 'https://i.imgur.com/auYWc9m.png',
			non: 'https://i.imgur.com/0SOgM3c.png',
			online_dot: 'https://i.imgur.com/RxlOdPR.png',
			no: 'https://i.imgur.com/cLuG3JM.png',
			ah: 'https://i.imgur.com/OyPEd0T.png',
			pepeok: 'https://discordemoji.com/assets/emoji/6491_FeelsOKMan.png',
			pepeping: 'https://discordemoji.com/assets/emoji/9044_peepoping.png',
		};

		const m = await super.send('**Ajout des emojis en cours !**');
		const failed = [];
		for (const [link, name] of Object.keys(emojis)) {
			try {
				await message.guild.emojis.create(link, name, {reason: 'Commande emotepack.'});
			} catch (e) {
				if (e.message.includes('Maximum number of emojis reached')) failed.push(name);
			}
		}

		const embed = new MessageEmbed();
		embed.setColor('0xFF8000');
		embed.setTitle('Opération complétée avec succès.');
		embed.setDescription('Emojis ajoutés.');
		if (failed.length > 0)
			embed.addField(
				"⚠️ Certains émojis n'ont pas marché !",
				`${failed.length} émojis n'ont pas pu être ajouté dans les ${
					Object.keys(emojis).length
				} émojis de cette commande\nVeuillez supprimer des émojis pour permettre l'ajout de ces derniers.`
			);
		embed.setFooter(message.client.user.username, message.client.user.displayAvatarURL());
		embed.setTimestamp();

		await m.edit(embed);
		tryDeleteMessage(m, 6000);
	}
};
