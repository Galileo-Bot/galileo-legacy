const {argError} = require('../../utils/Errors.js');
const {formatDate} = require('../../utils/FormatUtils.js');
const Command = require('../../entities/Command.js');
const {BetterEmbed} = require('discord.js-better-embed');

module.exports = class EmojiCommand extends Command {
	constructor() {
		super({
			aliases: ['émojis', 'émoji', 'emoji', 'emote', 'emotes'],
			description: "Permet d'avoir la liste des émojis du serveur ou des informations sur un émoji.",
			name: 'emoji',
			usage: 'emoji <emoji>\nemoji liste',
		});
	}

	addEmojis(text, emojis, embed) {
		if (emojis.join(' ').length > 1024) {
			embed.addField(text, emojis.slice(0, Math.floor(emojis.length / 2)).join(' '));
			embed.addField('\u200B', emojis.slice(Math.floor(emojis.length / 2)).join(' '));
		} else embed.addField(text, emojis.join(' '));
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const emoji = args[0] || null;
		const embed = BetterEmbed.fromTemplate('basic', {
			client,
		});
		embed.setColor('#1ae831');
		embed.setAuthor(
			"Informations sur l'émoji :",
			message.author.displayAvatarURL({
				dynamic: true,
			})
		);

		if (!emoji) return argError(message, this, 'Veuillez mettre un émoji ou `liste`.');

		if (['list', 'liste', 'ls'].includes(emoji)) {
			const emojis = message.guild.emojis.cache
				.filter(e => {
					if (!e.animated) return e;
				})
				.map(e => e.toString());

			const animEmojis = message.guild.emojis.cache
				.filter(e => {
					if (e.animated) return e;
				})
				.map(e => e.toString());

			embed.setAuthor('Liste des emojis du serveur : ', message.guild.iconURL());
			this.addEmojis('<:bnote:635163385645760523> émojis simples :', emojis, embed);
			this.addEmojis('<:gif:635159036504834051> émojis animés :', animEmojis, embed);

			embed.setColor('#1ae831');
			return super.send(embed);
		}

		const emojiFind = message.guild.emojis.cache.find(e => e.name === name);
		if (!emojiFind) return argError(message, this, "Cet émoji n'a pas été trouvé sur le serveur ou est un émoji de base.");

		const anim = emojiFind.animated;
		const id = emojiFind.id;
		const name = emoji.includes('<') ? emoji.slice(emoji.indexOf(':') + 1, emoji.lastIndexOf(':')) : args[0];

		if (id) {
			anim ? embed.setImage(`https://cdn.discordapp.com/emojis/${id}.gif`) : embed.setImage(`https://cdn.discordapp.com/emojis/${id}.png`);
			embed.setDescription(
				`<:smiley:635159054989262848> émoji : ${emojiFind}\n🆔 ID : **${id}**\n<:carte:635159034395361330> Nom : **${name}**\n${
					emojiFind.createdAt ? `<:richtext:635163364875698215> Créé le : **${formatDate('dd/MM/yyyy** à **hh:mm', emojiFind.createdAt)}**` : ''
				}`
			);

			await super.send(embed);
		}
	}
};
