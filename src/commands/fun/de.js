const {argTypes} = require('../../constants.js');
const {getArg} = require('../../utils/ArgUtils.js');
const Command = require('../../entities/Command.js');
const {argError} = require('../../utils/Errors.js');

module.exports = class DeCommand extends Command {
	constructor() {
		super({
			aliases: ['random', 'dé'],
			description: 'Permet de tirer un nombre aléatoire entre 1 et le premier nombre ou entre le premier et le deuxième nombre.',
			name: 'de',
			usage: 'de\nde <max>\nde <min> <max>',
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		/**
		 * @type {number}
		 */
		let nbrMax = getArg(message, 1, argTypes.number) ?? 6;
		let nbrMin = 1;

		if (args.length === 2) {
			nbrMin = getArg(message, 1, argTypes.number);
			nbrMax = getArg(message, 2, argTypes.number);
		}

		if (nbrMin === nbrMax) return argError(message, this, '<a:attention:613714368647135245> **Veuillez entrer 2 nombres différents.**');
		if (nbrMax === 0) return argError(message, this, '<a:attention:613714368647135245> **Veuillez entrer un nombre différent de 0.**');

		const nbrFinal = Math.floor(Math.random() * (nbrMax - nbrMin) + nbrMin);
		return super.send(`Nombre aléatoire généré entre ${nbrMin} et ${nbrMax}.\nRésultat : ${nbrFinal}.`);
	}
};
