const SlowCommand = require('./SlowCommand.js');
const ImgFlip = require('imgflip').default;

module.exports = class IMGFlipCommand extends SlowCommand {
	argsMaxLength = 20;
	argsNumber = 2;
	font;
	templateID;

	/**
	 * Créé une nouvelle commande de Meme.
	 * @param {MemeCommandOptions} options - Les options du constructeur.
	 */
	constructor(options) {
		super(options);
		this.templateID = options.templateID;
		this.argsNumber = options.argsNumber;
		this.argsMaxLength = options.argsMaxLength;
		this.font = options.font;
	}

	connectAPI() {
		const username = 'Ayfri';
		const password = 'galileo_optifdp';
		const texts = [];
		const imgFlip = new ImgFlip({
			username,
			password,
		});
		return {
			texts,
			imgFlip,
		};
	}

	async createMeme(imgFlipInstance, texts) {
		const memeURL = await imgFlipInstance.meme(this.templateID, {
			captions: texts,
			font: this.font ? this.font : 'impact',
		});

		await this.sendMeme(memeURL);
	}

	async processMeme(args, message) {
		const {texts, imgFlip} = this.connectAPI();

		args = args.join(' ').split(' ; ');

		for (let i = 0; i < this.argsNumber; i++) {
			texts[i] = args[i] ? args[i] || message.mentions.members?.first() : message.guild?.members.cache.random()?.displayName || message.member?.displayName || message.author.username;
			if (texts[i].length > this.argsMaxLength) {
				return message.channel?.send(`<a:attention:613714368647135245> **L'argument numéro ${i + 1} est trop long ${message.author}** _(${this.argsMaxLength} caractères maximum)_ **!**`);
			}
		}

		await this.startWait();
		await this.createMeme(imgFlip, texts);
		await this.stopWait();
	}

	async run(client, message, args) {
		await super.run(client, message, args);
	}

	async sendMeme(memeURL) {
		await super.send('Voici votre image :', {
			files: [
				{
					attachment: memeURL,
					name: 'meme.png',
				},
			],
		});
	}
};
