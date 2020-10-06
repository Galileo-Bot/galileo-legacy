const SlowCommand = require('../../classes/SlowCommand.js');
const {argError} = require('../../utils/Errors.js');
const {MessageEmbed} = require('discord.js');

module.exports = class CiterCommand extends SlowCommand {
	constructor() {
		super({
			name: 'citer',
			description: "Permet d'afficher un message dans un embedGenerated.",
			usage: 'citer [lien/ID de message]',
			aliases: ['citation', 'quote'],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		if (!args[0]) return argError(message, this, 'Veuillez mettre un lien de message ou une ID de message.');
		const files = [];
		let link = args[0].split('/');
		let channel = message.channel;
		let msg;

		await this.startWait();
		if (args.join(' ').match(/https:\/\/(canary|ptb)?\.?discord(app)?\.com\/channels\//)) {
			channel = client.channels.resolve(link[5]);
			msg = await channel.messages.fetch(link[6]);
		} else if (args[0].match(/\d{17,19}/) && message.guild) {
			const channels = message.guild.channels.cache.filter(c => c.type === 'text' && c.permissionsFor(c.guild.me).has('VIEW_CHANNEL'));

			for (const channel of channels.array()) {
				const messages = await channel.messages.fetch();
				msg = messages.find(m => m.id === args[0]) || null;
				if (msg) break;
			}
		}

		if (!channel) return argError(message, this, "Le salon n'a pas été trouvé, vérifiez que le bot a la permission de le voir.");
		if (!msg) return argError(message, this, "Le message n'a pas été trouvé ou est trop vieux.");

		await this.stopWait();
		link = `https://discordapp.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`;

		const embed = new MessageEmbed();
		embed.setAuthor(`Citation d'un message de : ${msg.author.tag}`, msg.author.displayAvatarURL(), link);
		embed.setFooter(`Envoyé sur le serveur ${msg.guild.name}.`, msg.guild.iconURL());
		embed.setTimestamp(msg.createdTimestamp);

		if (msg.embeds.length === 0) {
			embed.setDescription(msg.content);
		} else {
			const msgEmbed = msg.embeds[0];
			embed.setTitle(msgEmbed.title.length > 0 ? msgEmbed.title : msgEmbed.author.name.length > 0 ? msgEmbed.author.name : '');
			embed.setDescription(msgEmbed.description);
			embed.addFields(...msgEmbed.fields);
			embed.setColor(msgEmbed.color);
			embed.setImage(msgEmbed.image);
			embed.setThumbnail(msgEmbed.thumbnail);
		}

		if (msg.attachments.size > 0) {
			if (msg.attachments.first().size > 0) embed.image.url = msg.attachments.first().url;
			if (msg.attachments.first().filename) files[0] = msg.attachments.first().url;
		}

		if (msg.reactions.cache.size > 0) {
			embed.addField(
				'Réactions :',
				msg.reactions.cache
					.array()
					.map(r => `${r.emoji} : ${r.count}`)
					.join('\n')
			);
		}

		await message.channel?.send({
			embed,
			files,
		});
	}
};
