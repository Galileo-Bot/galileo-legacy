const SlowCommand = require('./SlowCommand.js');
const {MessageEmbed} = require('discord.js');
const Logger = require('../utils/Logger.js');
const jimp = require('jimp');
const imgur = require('imgur');
const {isOwner} = require('../utils/Utils.js');
const {runError} = require('../utils/Errors.js');
const {argTypes} = require('../constants.js');
const {getArg} = require('../utils/ArgUtils.js');

module.exports = class ImageCommand extends SlowCommand {
	constructor(options) {
		super(options);
	}

	/**
	 * Fait une commande image, la fonction étant personnalisable.
	 * @param {Message} message - Le message.
	 * @param {string} imageFunction - Le nom de la fonction.
	 * @param {*} argsFunction - Les arguments de la fonction.
	 * @returns {Promise<void>}
	 */
	async imageCommand(message, imageFunction, ...argsFunction) {
		await this.startWait();

		let imageLink = getArg(message, 1, argTypes.user)?.displayAvatarURL({format: 'png'}) || message.author.displayAvatarURL({format: 'png'});
		if (message.attachments.array()[0]?.height) imageLink = message.attachments.array()[0].url;

		jimp.read(imageLink)
			.then(image => {
				image[imageFunction](...argsFunction);
				image.write(`./assets/images/${imageFunction}.png`);
			})
			.then(() =>
				imgur.uploadFile(`./assets/images/${imageFunction}.png`).then(json => {
					const embed = new MessageEmbed();
					embed.setTitle('Image traitée : ');
					embed.setDescription(`[Cliquez pour ouvrir l'image.](${json.data.link})`);
					embed.setColor('#4b5afd');
					embed.setTimestamp();
					embed.setImage(json.data.link);
					embed.setFooter(message.client.user.username, message.client.user.displayAvatarURL());

					message.channel?.send(embed);
					this.stopWait();
				})
			)
			.catch(error => {
				if (isOwner(message.author.id)) {
					runError(message, this, error);
					Logger.warn(error.stack, `${super.name}Command`);
				} else {
					this.send("Oups !\nQuelque chose n'a pas marché, l'erreur est reportée aux dirigeants du bot. :eyes:");
				}
			});
	}

	async run(client, message, args) {
		await super.run(client, message, args);
	}
};
