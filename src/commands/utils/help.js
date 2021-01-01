const Command = require('../../entities/Command.js');
const {BetterEmbed} = require('discord.js-better-embed');
const {verifyCommand} = require('../../utils/CommandUtils.js');
const {argTypes, categories, permissions, tags} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const {argError} = require('../../utils/Errors.js');
const {isOwner} = require('../../utils/Utils.js');

module.exports = class HelpCommand extends Command {
	constructor() {
		super({
			aliases: ['aide', 'h', 'gh'],
			description: "Permet d'avoir la liste des commandes ainsi que des informations sur chacune.",
			name: 'help',
			tags: [tags.help_command],
			usage: 'help <commande>\nhelp',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const customCategories = JSON.parse(JSON.stringify(categories));
		/**
		 * @type {null|Command}
		 */
		let command = null;
		customCategories.hidden = null;

		if (args?.length > 0) {
			command = getArg(message, 1, argTypes.command);
		}

		const embed = BetterEmbed.fromTemplate('basic', {
			client,
		});
		embed.setColor('#36393e');

		if (['toutes', 'all'].includes(args[0]) || !args[0]) {
			embed.setTitle('📃 Liste des commandes en service.');
			embed.setDescription("❔ **help <commande>** : Vous permet d'avoir des informations sur la commande ciblée.");

			if (!isOwner(message.author.id)) {
				customCategories.owner = null;
				customCategories.wip = null;
			}

			for (const category in customCategories) {
				if (!customCategories.hasOwnProperty(category) || !customCategories[category]) continue;

				const commands = client.commands.filter(c => c.category === category);
				const categoriesCommandsString = `\`${commands
					.array()
					.map(c => c.name)
					.sort(new Intl.Collator().compare)
					.join('` ** | ** `')}\``;

				if (categoriesCommandsString.length !== 2) {
					embed.addField(`<a:cecia:635159108080631854> Commandes ${categories[category].toLowerCase()} : `, categoriesCommandsString);
				}
			}

			return super.send(embed);
		}

		if (!command) return argError(message, this, `Commande ${args[0]} non trouvée.`);
		if (command.category === 'wip' && !isOwner(message.author.id)) return;

		const isAllowed = verifyCommand(command, message);
		const userPermissions = command.userPermissions
			.map(perm => permissions[perm])
			.sort(new Intl.Collator().compare)
			.join('\n');
		const clientPermissions = command.clientPermissions
			.map(perm => permissions[perm])
			.sort(new Intl.Collator().compare)
			.join('\n');

		embed.setAuthor(`Aide de la commande ${command.name}`, client.user.displayAvatarURL());
		embed.setDescription(
			`<a:attention:613714368647135245> **[]** = Obligatoire, **<>** = Optionnel\nCatégorie : **${categories[command.category]}**\nAccès à la commande : **${
				isAllowed.isFailed ? 'Non' : 'Oui'
			}**.`
		);
		embed.addField('📋 Description de la commande :', command.description);
		embed.addField('<:engrenage:539121213793107978> Syntaxe :', `\`${command.hasOwnProperty('usage') ? command.usage : command.name}\``);
		if (userPermissions || clientPermissions) {
			embed.addField(
				'Permissions nécessaires :',
				`${command.category === 'owner' ? '> **Membre** :\nÊtre gérant du bot.' : userPermissions ? `> **Membre** :\n${userPermissions}` : ''}\n\n${
					clientPermissions ? `> **Bot** :\n${clientPermissions}` : ''
				}`
			);
		}

		if (command.tags.length > 0) embed.addField(`Propriété${command.tags.length > 1 ? 's' : ''} :`, `${command.tags.join('\n')}`);
		if (command.aliases.length > 0) embed.addField('📝 Alias de la commande :', `\`${command.aliases.join(', ')}\``);

		return super.send(embed);
	}
};
