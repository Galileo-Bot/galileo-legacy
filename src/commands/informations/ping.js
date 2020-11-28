const {tags} = require('../../constants.js');
const Command = require('../../entities/Command.js');
const Embed = require('../../utils/Embed.js');

module.exports = class PingCommand extends Command {
	constructor() {
		super({
			name: 'ping',
			description: "Permet de connaître le ping du bot de l'API.",
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const m = await super.send('Ping :thinking: ?');
		const embed = Embed.fromTemplate('basic', {
			client,
		});

		embed.setColor('#36393e');
		embed.setTitle('🏓 Pong !');
		embed.setThumbnail(client.user.avatarURL());
		embed.addField('🤖 Latence du bot', `${m.createdTimestamp - message.createdTimestamp} ms`, true);
		embed.addField("📡 Latence de l'API :", `${Math.round(client.ws.ping)} ms`, true);

		await m.edit('', embed);
	}
};
