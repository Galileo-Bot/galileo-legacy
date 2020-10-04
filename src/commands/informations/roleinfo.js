const {MessageEmbed} = require('discord.js');
const imgur = require('imgur');
const jimp = require('jimp');
const {argTypes, tags} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');
const {parseDate} = require('../../utils/FormatUtils.js');
const Command = require('../../entities/Command.js');
const {permissions} = require('../../constants.js');

module.exports = class RoleInfoCommand extends Command {
	constructor() {
		super({
			name: 'roleinfo',
			description: "Permet d'avoir des informations sur un rôle.",
			usage: 'roleinfo <ID/Nom de rôle>',
			aliases: ['ri', 'role-info'],
			tags: [tags.guild_only],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		let thumbnailColor;
		const waitEmoji = client.emojis.cache.get('638831506126536718');
		const role = getArg(message, 1, argTypes.role);
		if (!args[0]) return argError(message, this, 'Veuillez mettre un rôle.');
		if (!role) return argError(message, this, "Le rôle n'a pas été trouvé ou n'existe pas.");

		const color = role.hexColor === '#000000' ? '#7289da' : role.hexColor;

		await message.react(waitEmoji);
		const image = await new jimp(256, 256, color);
		await image.write('./assets/images/colorRole.png');

		while (!thumbnailColor) {
			thumbnailColor = await imgur.uploadFile('./assets/images/colorRole.png');
		}

		const embed = new MessageEmbed();
		embed.setTimestamp();
		embed.setColor('#4b5afd');
		embed.setThumbnail(thumbnailColor.data.link);
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		embed.setTitle(`<a:cecia:635159108080631854> Informations sur le rôle : ${role.name}`);
		embed.addField('🆔 :', role.id, true);
		embed.addField('<:textuel:635159053630308391> Nom :', role, true);
		embed.addField(
			'<:richtext:635163364875698215> Nombre de membres ayant le rôle :',
			`${role.members.size} (${Math.round((role.members.size / message.guild.members.cache.size) * 1000) / 10}% des membres du serveur)`
		);
		embed.addField('<:hey:635159039831048202> Mentionable :', role.mentionable ? '<:enablevert:635159048639086592>' : '<:disable:635255629694369812>', true);
		embed.addField('<:richtext:635163364875698215> Rôle affiché séparément :', role.hoist ? '<:enablevert:635159048639086592>' : '<:disable:635255629694369812>', true);
		embed.addField('🖌 Couleur hexadécimale :', color, true);
		embed.addField('<a:join:539121286618546197> Créé le :', parseDate('dd/MM/yyyy hh:mm', role.createdAt), true);

		if (role.permissions.toArray().length > 0)
			embed.addField(
				'Permissions',
				role.permissions
					.toArray()
					.map(perm => permissions[perm])
					.sort()
					.join('\n')
			);

		await super.send(embed);
		await message.reactions.cache.find(reaction => reaction.emoji === waitEmoji).users.remove(message.client.user.id);
	}
};
