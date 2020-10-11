const Logger = require('../utils/Logger.js');
const Event = require('../entities/Event.js');
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
		const embed = new MessageEmbed();
		embed.setTimestamp();
		embed.setAuthor(`Rate limit : ${rateLimitInfo.path}`);
		embed.setDescription(`Le bot est en rate limit sur la route : ${rateLimitInfo.route}\nAvec le chemin : ${rateLimitInfo.path}`);
		embed.addField('Temps à attendre : ', `**${rateLimitInfo.timeout}** ms`);
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		sendLogMessage(client, 'rateLimit', embed);
	}
};
