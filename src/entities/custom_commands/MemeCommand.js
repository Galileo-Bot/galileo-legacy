const SlowCommand = require('./SlowCommand.js');
const {BetterEmbed} = require('discord.js-better-embed');
const {argError} = require('../../utils/Errors.js');
const ImgFlip = require('imgflip').default;

module.exports = class IMGFlipCommand extends SlowCommand {
	argsMaxLength = 30;
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
		return new ImgFlip({
			password: process.env.IMGFLIP_PASSWORD,
			username: process.env.IMGFLIP_USERNAME,
		});
	}

	async createMeme(imgFlipInstance, texts) {
		const memeURL = await imgFlipInstance.meme(this.templateID, {
			captions: texts,
			font: this.font ? this.font : 'impact',
		});

		await this.sendMeme(memeURL);
	}

	async processMeme(args, message) {
		const imgFlip = this.connectAPI();
		const texts = [];

		args = args.join(' ').split(' ; ');

		if (args.length < this.argsNumber)
			return argError(message, this, `Veuillez mettre ${this.argsNumber} arguments (séparés par des \`;\`) comme le rappel ci-dessous :arrow_down:.`);

		for (let i = 0; i < this.argsNumber; i++) {
			texts[i] = args[i];
			if (texts[i].length > this.argsMaxLength) {
				return message.channel?.send(
					`<a:attention:613714368647135245> **L'argument numéro ${i + 1} est trop long ${message.author}** _(${this.argsMaxLength} caractères maximum)_ **!**`
				);
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
		const embed = BetterEmbed.fromTemplate('image', {
			client: this.client,
			description: `[Cliquez ici pour avoir le lien.](${memeURL})`,
			image: memeURL,
			title: 'Voici votre mème : ',
		});
		await super.send(embed);
	}
};
