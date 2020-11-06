const {MessageEmbed} = require('discord.js');
const Jimp = require('jimp');
const Command = require('../../entities/Command.js');
const {argError} = require('../../utils/Errors.js');
const {random, readJSON} = require('../../utils/Utils.js');
const {colors} = require('../../assets/jsons/constants.json');

module.exports = class CouleurCommand extends Command {
	constructor() {
		super({
			name: 'couleur',
			description: "Permet de générer ou de voir la couleur d'un code hexadécimale.",
			usage: 'couleur <couleur hexadécimale>\ncouleur random',
			aliases: ['color'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const hexColors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
		const embed = new MessageEmbed();
		let color = '';
		let image = null;

		if (args[0] === 'random' || args.length === 0) {
			color = '#';
			for (let i = 0; i <= 5; i++) {
				color += random(hexColors);
			}
		} else {
			for (const property in colors) {
				if (Object.prototype.hasOwnProperty.call(colors, property) && colors[property].includes(args[0].toLowerCase())) {
					color = property;
					break;
				}
			}

			if (color !== args[0]) {
				if ((args[0].startsWith('#') && args[0].length === 7) || !isNaN(parseInt(args[0]))) {
					if (args[0].startsWith('#')) args[0] = args[0].substring(1);
					if (args[0].length !== 6 || [...args[0]].some(c => !hexColors.includes(c.toLowerCase()))) return argError(message, this, 'Veuillez mettre une couleur hexadécimale valable.');
					color = `#${args[0]}`;
				}

				if (color.length === 0) return argError(message, this, "Veuillez mettre une couleur hexadécimale valable ou le nom d'une couleur valable ou `random`.");
			}
		}

		do {
			image = new Jimp(256, 128, color);
			await image.write('./assets/images/color.png', err => {
				if (err) console.error(err);
			});
		} while (!image);

		embed.setTimestamp();
		embed.setFooter(client.user.username, client.user.displayAvatarURL());
		embed.setTitle(`Couleur : ${color}`);
		embed.setColor(color);

		setTimeout(async () => {
			embed.attachFiles(['./assets/images/color.png']);
			await super.send(embed);
		}, 500);
	}
};
