const Command = require('../../entities/Command.js');
const {random} = require('../../utils/Utils.js');
const fetch = require('node-fetch');
module.exports = class MemeCommand extends Command {
	constructor() {
		super({
			name: 'meme',
			description: 'Envoie un mème aléatoire.',
			aliases: ['mème', 'même', 'reddit'],
			usage: 'meme\nmeme <subreddit>',
		});
	}

	static async getRandomMemeFromSubreddit(subreddit) {
		return random((await (await fetch(`https://imgur.com/r/${subreddit}/hot.json`)).json()).data);
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		const subreddit = args[0].toLowerCase() ?? 'meme';

		const meme = await MemeCommand.getRandomMemeFromSubreddit(subreddit);
		super.send(`https://imgur.com/${meme.hash}${meme.ext.replace(/\?.*/, '')}`);
	}
};
