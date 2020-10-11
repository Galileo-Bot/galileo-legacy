const {formatWithRange} = require('../utils/FormatUtils.js');
const {CommandManager} = require('../../index.js');
const Logger = require('../utils/Logger.js');
const Event = require('../entities/Event.js');
const {getPrefixFromMessage} = require('../utils/Utils.js');
const {sendLogMessage} = require('../utils/Utils.js');
const {MessageEmbed} = require('discord.js');

module.exports = class RateLimitEvent extends Event {
	constructor() {
		super({
			name: 'rateLimit',
		});
	}

	/**
	 * Runned when event is emmited.
	 * @param {GaliClient} client - Le client.
	 * @param {module:"discord.js".RateLimitData} rateLimitInfo
	 * @returns {Promise<void>} - Nothing.
	 */
	async run(client, rateLimitInfo) {
		await super.run();

		Logger.warn(`RateLimit : ${rateLimitInfo.path}`);
		const routes = rateLimitInfo.route.split('/');
		const channel = client.channels.cache.get(routes[1]) ?? null;
		const message = (await channel?.fetch())?.messages.cache.get(routes[3]) ?? null;

		const informations = message ? `[Message](${(await channel.fetch()).messages.cache.get(message).url})\nChannel : ${channel.name}(\`${channel.id}\`)` : null;

		const embed = new MessageEmbed();
		embed.setTimestamp();
		embed.setAuthor(`Rate limit :`);
		embed.setDescription(`Le bot est en rate limit sur la route : \`\`\`js${rateLimitInfo.route}\`\`\`\nAvec le chemin : \`\`\`js${decodeURI(rateLimitInfo.path)}\`\`\``);
		embed.addField('Temps à attendre : ', `**${rateLimitInfo.timeout}** ms`);
		embed.setFooter(client.user.username, client.user.displayAvatarURL());

		if (informations) {
			embed.addField('Informations : ', informations);
			embed.addField('Commande :', CommandManager.findCommand(message.content.slice(getPrefixFromMessage(message).length)).name);
			embed.addField('Message :', formatWithRange(message.content, 1024));
		}

		sendLogMessage(client, 'rateLimit', embed);
	}
};
