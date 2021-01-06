const {Collection, MessageFlags} = require('discord.js');
const {TAGS} = require('../constants.js');
const CommandManager = require('../entities/CommandManager.js');
const Event = require('../entities/Event.js');
const {verifyCommand, processCommandFail} = require('../utils/CommandUtils.js');
const {runError} = require('../utils/Errors.js');
const Logger = require('../utils/Logger.js');
const {BetterEmbed} = require('discord.js-better-embed');
const {getPrefixFromMessage, isOwner, sendLogMessage} = require('../utils/Utils.js');

module.exports = class MessageEvent extends Event {
	/**
	 * Les cooldowns.
	 * @type {Collection<module:"discord.js".Snowflake, CooldownCommand[]>}
	 */
	static cooldown = new Collection();

	constructor() {
		super({
			name: 'message',
		});
	}

	/**
	 * La méthode exécutée quand un message est envoyé n'importe où.
	 * @param {GaliClient} client - Le client.
	 * @param {Message} message - Le message.
	 * @returns {void}
	 */
	async run(client, message) {
		await super.run(client);
		if (message.author.bot || message.system || message.flags.has(MessageFlags.FLAGS.CROSSPOSTED)) return;

		const prefix = getPrefixFromMessage(message);

		if (!prefix) {
			if (message.guild === null) {
				const embed = BetterEmbed.fromTemplate('author', {
					author: `Message reçu de ${message.author.tag} (${message.author.id})`,
					authorURL: message.author.displayAvatarURL({
						dynamic: true,
					}),
					client,
					description: '',
				});
				embed.setColor('RANDOM');
				if (message.attachments.array()[0]?.height) embed.setImage(message.attachments.array()[0].url);
				if (!embed.image && message.embeds[0]?.image?.height) embed.setImage(message.embeds[0].image.url);
				await sendLogMessage(client, 'MP', embed);
			}

			return;
		}

		if (message.content === prefix) {
			return CommandManager.commands
				.filter(command => command.tags.includes(TAGS.PREFIX_COMMAND))
				.forEach(command => {
					message.content = prefix;
					this.logCommandExecution(message, command.name);
					this.executeCommand(client, message, [], command);
				});
		}

		const args = message.content.slice(prefix.length).trim().split(/\s+/g);
		const command = CommandManager.findCommand(args[0]);
		args.shift();

		if (command) {
			this.logCommandExecution(message, command.name);
			const fail = verifyCommand(command, message);
			if (fail.isFailed) processCommandFail(fail, message, command);
			else this.executeCommand(client, message, args, command);
		} else {
			return CommandManager.commands
				.filter(command => command.tags?.includes(TAGS.HELP_COMMAND))
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
	 * @returns {void}
	 */
	executeCommand(client, message, args, command) {
		if (!MessageEvent.cooldown.has(message.author.id)) MessageEvent.cooldown.set(message.author.id, []);

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
				const stats = client.dbManager.messages.get('stats');
				stats[stats.length - 1]++;
				client.dbManager.messages.set('stats', stats);
			})
			.catch(async error => {
				Logger.warn(`Une erreur a eu lieu avec la commande ${command.name}, erreur : \n${error.stack}`, 'CommandExecution');
				Error.stackTraceLimit = 3;
				await runError(message, command, error);
			});
	}

	/**
	 * Envoie dans les logs les informations nécessaires quand une commande est exécutée.
	 * @param {Message} message - Le message qui a exécuté la commande.
	 * @param {string} command - Le nom de la commande exécutée.
	 * @returns {void}
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
