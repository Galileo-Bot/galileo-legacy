const Command = require('../../entities/Command.js');
const {random} = require('../../utils/Utils.js');
const fetch = require('node-fetch');
const {BetterEmbed} = require('discord.js-better-embed');
module.exports = class MemeCommand extends Command {
	constructor() {
		super({
			aliases: ['mème', 'même', 'reddit'],
			description: 'Envoie un mème aléatoire depuis le subreddit \'meme\' ou celui inscrit.',
			name: 'meme',
			usage: 'meme\nmeme <subreddit>'
		});
	}

	static async getRandomMemeFromSubreddit(subreddit) {
		/**
		 * @typedef {Object} Image
		 * @property {boolean} animated
		 * @property {string} hash
		 * @property {string} ext
		 * @property {string} mimetype
		 * @property {boolean} in_gallery
		 * @property {object} adConfig
		 * @property {string[]} adConfig.safeFlags
		 */
		/**
		 * @type {Image[]}
		 */
		const images = (await (await fetch(`https://imgur.com/r/${subreddit}/hot.json`)).json()).data.filter(image => image.mimetype && image.mimetype.startsWith('image'));
		const image = random(images);
		return image ? `https://imgur.com/${image.hash}${image.ext.replace(/\?.*/, '')}` : null;
	}

	async run(client, message, args) {
		await super.run(client, message, args);
		const subreddit = args[0] ? args[0].toLowerCase() : 'meme';
		const embed = BetterEmbed.fromTemplate('basic', {
			client
		});

		let meme = await MemeCommand.getRandomMemeFromSubreddit(subreddit);
		embed.setDescription(`Mème venant du [subreddit \`${meme ? subreddit : 'meme'}\`](https://www.reddit.com/r/${subreddit}).
${meme ? '' : `(Subreddit \`${subreddit}\` non trouvé, ou pas d'image trouvée.)\n`}
[Cliquez ici pour avoir le lien.](${meme})`);
		embed.setTitle('Voici votre mème :');
		meme ??= await MemeCommand.getRandomMemeFromSubreddit('meme');
		embed.setImage(meme);
		embed.setURL(meme);

		await super.send(embed);
	}
};
