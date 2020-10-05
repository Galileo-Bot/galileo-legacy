const {Collection, MessageEmbed} = require('discord.js');
const {tags} = require('../constants.js');
const CommandManager = require('../entities/CommandManager.js');
const Event = require('../entities/Event.js');
const {verifyCommand, processCommandFail} = require('../utils/CommandUtils.js');
const {runError} = require('../utils/Errors.js');
const Logger = require('../utils/Logger.js');
const {getPrefixFromMessage, isOwner, sendLogMessage, readJSON, writeInJSON} = require('../utils/Utils.js');

module.exports = class MessageEvent extends Event {
	/**
	 * @type {Collection<module:"discord.js".Snowflake, [CooldownCommand]>}
	 */
	static cooldown = new Collection();

	constructor() {
		super({
			name: 'message',
		});
	}

	async run(client, message) {
		await super.run(client);
		if (message.author.bot || message.system) return;

		const prefix = getPrefixFromMessage(message);

		// Si mp
		if (!prefix) {
			if (message.guild === null) {
				const embed = new MessageEmbed();
				embed.setAuthor(`Message reçu de ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL());
				embed.setDescription(message);
				embed.setColor('RANDOM');
				embed.setTimestamp();
				embed.setFooter(client.user.username, client.user.displayAvatarURL());
				if (message.attachments.array()[0]?.height) embed.setImage(message.attachments.array()[0].url);
				if (!embed.image && message.embeds[0]?.image?.height) embed.setImage(message.embeds[0].image.url);
				sendLogMessage(client, 'mp', embed);
			}

			return;
		}

		// If only prefix
		if (message.content === prefix) {
			return CommandManager.commands
				.filter(command => command.tags.includes(tags.prefix_command))
				.forEach(command => {
					message.content = prefix;
					this.logCommandExecution(message, command.name);
					this.executeCommand(client, message, [], command);
				});
		}

		const args = message.content.slice(prefix.length).trim().split(/\s+/g);
		const command = CommandManager.findCommand(args[0]);
		args.shift();

		// Command has been found.
		if (command) {
			this.logCommandExecution(message, command.name);
			const fail = verifyCommand(command, message);
			if (fail.isFailed) {
				processCommandFail(fail, message, command);
			} else this.executeCommand(client, message, args, command);
		} else {
			return CommandManager.commands
				.filter(command => command.tags?.includes(tags.help_command))
				.forEach(command => {
					message.content = prefix + command.name;
					this.logCommandExecution(message, command.name);
					this.executeCommand(client, message, [], command);
				});
		}
	}

	/**
	 * Execute une commande.
	 * @param {GaliClient} client - Le client.
	 * @param {Message} message - Le message.
	 * @param {string[]} args - Les arguments.
	 * @param {Command} command - La commande.
	 */
	executeCommand(client, message, args, command) {
		// Cooldowns
		if (!MessageEvent.cooldown.has(message.author.id)) {
			MessageEvent.cooldown.set(message.author.id, []);
		}

		if (!MessageEvent.cooldown.get(message.author.id).find(c => c.command === command.name) && !isOwner(message.author.id)) {
			const date = new Date(Date.now() + command.cooldown * 1000);
			MessageEvent.cooldown.get(message.author.id).push({
				command: command.name,
				releasingAt: date,
			});

			setTimeout(
				() =>
					MessageEvent.cooldown.set(
						message.author.id,
						MessageEvent.cooldown.get(message.author.id).filter(c => c.command !== command.name)
					),
				command.cooldown * 1000
			);
		}

		command
			.run(client, message, args)
			.then(() => {
				const messages = readJSON('./assets/jsons/messages.json');
				messages.stats[messages.stats.length - 1]++;
				writeInJSON('./assets/jsons/messages.json', messages);

				// Error in command.
			})
			.catch(error => {
				Logger.warn(`Une erreur a eu lieu avec la commande ${command.name}, erreur : \n${error.stack}`, 'CommandExecution');
				Error.stackTraceLimit = 3;
				runError(message, command, error);
			});
	}

	/**
	 * Envoie dans les logs les informations nécessaires quand une commande est exécutée.
	 * @param {Message} message - Le message qui a exécuté la commande.
	 * @param {String} command - Le nom de la commande exécutée.
	 */
	logCommandExecution(message, command) {
		Logger.log(
			`Commande '${command}' exécutée ${
				message.guild ? `sur le serveur '${message.guild.name}' (${message.guild.id}) dans le salon '${message.channel.name}' (${message.channel.id})` : ' en privé '
			} par ${message.author.tag} (${message.author.id})`,
			'MessageEvent'
		);
	}
};
