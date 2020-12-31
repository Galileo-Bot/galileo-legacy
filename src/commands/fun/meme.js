const Command = require('../../entities/Command.js');
const {random} = require('../../utils/Utils.js');
const fetch = require('node-fetch');
const {BetterEmbed} = require('discord.js-better-embed');
module.exports = class MemeCommand extends Command {
	constructor() {
		super({
			name: 'meme',
			description: "Envoie un mème aléatoire depuis le subreddit 'meme' ou celui inscrit.",
			aliases: ['mème', 'même', 'reddit'],
			usage: 'meme\nmeme <subreddit>',
		});
	}

	static async getRandomMemeFromSubreddit(subreddit) {
		const image = random((await (await fetch(`https://imgur.com/r/${subreddit}/hot.json`)).json()).data);
		return image ? `https://imgur.com/${image.hash}${image.ext.replace(/\?.*/, '')}` : null;
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		const subreddit = args[0] ? args[0].toLowerCase() : 'meme';

		const meme = await MemeCommand.getRandomMemeFromSubreddit(subreddit);
		const embed = BetterEmbed.fromTemplate('image', {
			client,
			title: 'Voici votre mème :',
			description: `Mème venant du [subreddit \`${subreddit}\`](https://www.reddit.com/r/${subreddit}).\n${
				meme ? '' : `(Subreddit \`${subreddit}\` non trouvé.)`
			}\n\n[Cliquez ici pour avoir le lien.](${meme})`,
			image: meme ?? (await MemeCommand.getRandomMemeFromSubreddit('meme')),
		});

		await super.send(embed);
	}
};
