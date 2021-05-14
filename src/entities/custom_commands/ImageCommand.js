const SlowCommand = require('./SlowCommand.js');
const Logger = require('../../utils/Logger.js');
const jimp = require('jimp');
const {BetterEmbed} = require('discord.js-better-embed');
const {isOwner} = require('../../utils/Utils.js');
const {runError} = require('../../utils/Errors.js');
const {ARG_TYPES} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');

module.exports = class ImageCommand extends SlowCommand {
	/**
	 * Fait une commande image, la fonction étant personnalisable.
	 * @param {module:"discord.js".Message} message - Le message.
	 * @param {string} imageFunction - Le nom de la fonction.
	 * @param {*} argsFunction - Les arguments de la fonction.
	 * @returns {Promise<void>}
	 */
	async imageCommand(message, imageFunction, ...argsFunction) {
		const user = getArg(message, 1, ARG_TYPES.USER) ?? message.author;
		let userAvatar = user?.displayAvatarURL({format: 'png'});
		if (message.attachments.array()[0]?.height) userAvatar = message.attachments.array()[0].url;

		const link = await this.memoize(imageFunction, user.id);
		if (link) return await this.sendEmbed(link);

		try {
			await this.startWait();

			const image = await jimp.read(userAvatar);
			image[imageFunction](...argsFunction);
			await image.write(`./assets/images/${imageFunction}.png`);

			await this.sendEmbed(`./assets/images/${imageFunction}.png`);
			await this.stopWait();
		} catch (error) {
			if (isOwner(message.author.id) && error.stack) {
				runError(message, this, error);
				Logger.warn(error.stack, `${super.name}Command`);
			} else {
				await this.send("Oups !\nQuelque chose n'a pas marché, l'erreur est reportée aux dirigeants du bot. :eyes:");
			}
		}
	}

	/**
	 * Met dans le cache l'image pour éviter de la recréer à chaque fois.
	 * @param {string} type - Le type d'image à sauvegarder.
	 * @param {string} personID - L'id de la personnne.
	 * @param {string} [image] - Le lien de l'image.
	 * @returns {string | void} - L'image si déjà existante.
	 */
	memoize(type, personID, image) {
		this.client.dbManager.cache.ensure('images', '', type);
		if (this.client.dbManager.cache.has('images', `${type}.${personID}`) && this.client.dbManager.cache.get('images', `${type}.${personID}`)) {
			return this.client.dbManager.cache.get('images', `${type}.${personID}`);
		}
		this.client.dbManager.cache.set('images', image, `${type}.${personID}`);
	}

	async run(client, message, args) {
		await super.run(client, message, args);
	}

	async sendEmbed(link) {
		const embed = BetterEmbed.fromTemplate('title', {
			client: this.client,
			title: 'Image traitée : ',
		});
		embed.setImageFromFile(link);

		await super.send(embed);
	}
};
