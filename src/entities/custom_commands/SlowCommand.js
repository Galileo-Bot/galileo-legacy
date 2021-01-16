const Command = require('../Command.js');

module.exports = class SlowCommand extends Command {
	waitEmoji;

	async run(client, message, args) {
		await super.run(client, message, args);
		this.waitEmoji = client.emojis.resolve('638831506126536718');
	}

	async startWait() {
		await this.message.react(this.waitEmoji);
	}

	async stopWait() {
		await this.message.reactions.cache.find(r => r.emoji.id === this.waitEmoji.id)?.users.remove(this.message.client.user.id);
	}
};
