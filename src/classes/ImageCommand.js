const SlowCommand = require('./SlowCommand.js');
const Logger = require('../utils/Logger.js');
const Jimp = require('jimp');
const imgur = require('imgur');
const Embed = require('../utils/Embed.js');
const {isOwner} = require('../utils/Utils.js');
const {runError} = require('../utils/Errors.js');
const {argTypes} = require('../constants.js');
const {getArg} = require('../utils/ArgUtils.js');

module.exports = class ImageCommand extends SlowCommand {
	/**
	 * Fait une commande image, la fonction étant personnalisable.
	 * @param {module:"discord.js".Message} message - Le message.
	 * @param {string} imageFunction - Le nom de la fonction.
	 * @param {*} argsFunction - Les arguments de la fonction.
	 * @returns {Promise<void>}
	 */
	async imageCommand(message, imageFunction, ...argsFunction) {
		await this.startWait();

		let imageLink = getArg(message, 1, argTypes.user)?.displayAvatarURL({format: 'png'}) ?? message.author.displayAvatarURL({format: 'png'});
		if (message.attachments.array()[0]?.height) imageLink = message.attachments.array()[0].url;

		Jimp.read(imageLink)
			.then(image => {
				image[imageFunction](...argsFunction);
				image.write(`./assets/images/${imageFunction}.png`);
			})
			.then(() =>
				imgur.uploadFile(`./assets/images/${imageFunction}.png`).then(async json => {
					const embed = Embed.fromTemplate('image', {
						client: message.client,
						image: json.data.link,
						description: `[Cliquez pour ouvrir l'image.](${json.data.link})`,
						title: 'Image traitée : ',
					});

					await super.send(embed);
					await this.stopWait();
				})
			)
			.catch(async error => {
				if (isOwner(message.author.id)) {
					await runError(message, this, error);
					Logger.warn(error.stack, `${super.name}Command`);
				} else this.send("Oups !\nQuelque chose n'a pas marché, l'erreur est reportée aux dirigeants du bot. :eyes:");
			});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
	}
};
