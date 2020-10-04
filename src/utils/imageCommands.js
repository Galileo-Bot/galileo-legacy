const {MessageEmbed} = require('discord.js');
const imgur = require('imgur');
const jimp = require('jimp');
const Logger = require('./Logger.js');
const {runError} = require('./Errors.js');
const {isOwner} = require('./Utils.js');
const {argTypes} = require('../constants.js');
const {getArgAndVerify} = require('./ArgUtils.js');

/**
 * Fait une commande image, la fonction étant personnalisable.
 * @param {module:"discord.js".Message} message - Le message.
 * @param {Command} command - La commande (en cas d'erreur).
 * @param {string} imageFunction - Le nom de la fonction.
 * @param {*} argsFunction - Les arguments de la fonction.
 */
module.exports.imageCommand = async (message, command, imageFunction, ...argsFunction) => {
	const waitEmoji = message.client.emojis.resolve('638831506126536718');
	await message.react(waitEmoji);
	
	let imageLink = getArgAndVerify(message, 1, argTypes.user)?.displayAvatarURL({format: 'png'}) || message.author.displayAvatarURL({format: 'png'});
	if (message.attachments.array()[0]?.height) imageLink = message.attachments.array()[0].url;
	
	jimp.read(imageLink).then((image) => {
		image[imageFunction](...argsFunction);
		image.write(`./assets/images/${imageFunction}.png`);
	}).then(() =>
		imgur.uploadFile(`./assets/images/${imageFunction}.png`).then((json) => {
			const embed = new MessageEmbed();
			embed.setTitle('Image traitée : ');
			embed.setDescription(`[Cliquez pour ouvrir l'image.](${json.data.link})`);
			embed.setColor('#4b5afd');
			embed.setTimestamp();
			embed.setImage(json.data.link);
			embed.setFooter(message.client.user.username, message.client.user.displayAvatarURL());
			
			message.channel.send(embed);
			message.reactions.cache.find(reaction => reaction.emoji === waitEmoji).users.remove(message.client.user.id);
		}),
	).catch((error) => {
		if (isOwner(message.author.id)) {
			runError(message, command, error.stack);
			Logger.warn(error.stack);
		} else {
			message.channel.send('Oups !\nQuelque chose n\'a pas marché, l\'erreur est reportée aux dirigeants du bot. :eyes:');
		}
	});
};