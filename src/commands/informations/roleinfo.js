const SlowCommand = require('../../entities/custom_commands/SlowCommand.js');
const Jimp = require('jimp');
const dayjs = require('dayjs');
const {ARG_TYPES, TAGS, PERMISSIONS} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');
const {BetterEmbed} = require('discord.js-better-embed');

module.exports = class RoleInfoCommand extends SlowCommand {
	constructor() {
		super({
			aliases: ['ri', 'role-info'],
			description: "Permet d'avoir des informations sur un rôle.",
			name: 'roleinfo',
			tags: [TAGS.GUILD_ONLY],
			usage: 'roleinfo <ID/Nom de rôle>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		await message.guild.members.fetch();
		/**
		 * @type {module:"discord.js".Role | null}
		 */
		const role = getArg(message, 1, ARG_TYPES.ROLE);
		if (!args[0]) return argError(message, this, 'Veuillez mettre un rôle.');
		if (!role) return argError(message, this, "Le rôle n'a pas été trouvé ou n'existe pas.");

		const color = role.hexColor === '#000000' ? '#7289da' : role.hexColor;

		await this.startWait();
		const image = new Jimp(256, 256, color);
		await image.write('./assets/images/colorRole.png');

		const embed = BetterEmbed.fromTemplate('basic', {
			client,
		});

		embed.setThumbnailFromFile('./assets/images/colorRole.png');
		embed.setTitle(`<a:cecia:635159108080631854> Informations sur le rôle : ${role.name}`);
		embed.addField('🆔 :', role.id, true);
		embed.addField('<:textuel:635159053630308391> Nom :', role, true);

		const percentage = Math.round((role.members.size / message.guild.memberCount) * 1000) / 10;
		embed.addField('<:richtext:635163364875698215> Nombre de membres ayant le rôle :', `${role.members.size} (${percentage}% des membres du serveur)`);
		embed.addField('<:hey:635159039831048202> Mentionable :', role.mentionable ? '<:enablevert:635159048639086592>' : '<:disable:635255629694369812>', true);
		embed.addField('<:richtext:635163364875698215> Rôle affiché séparément :', role.hoist ? '<:enablevert:635159048639086592>' : '<:disable:635255629694369812>', true);
		embed.addField('🖌 Couleur hexadécimale :', color, true);
		embed.addField('<a:join:539121286618546197> Créé le :', dayjs(role.createdAt).format('DD/MM/YYYY hh:mm'), true);

		if (role.permissions.toArray().length > 0) {
			const permissions = role.permissions
				.toArray()
				.map(perm => PERMISSIONS[perm])
				.sort(new Intl.Collator().compare)
				.join('\n');
			embed.addField('Permissions :', permissions);
		}

		await super.send(embed);
		await this.stopWait();
	}
};
