const {argError} = require('../../utils/Errors.js');
const Command = require('../../entities/Command.js');
const Embed = require('../../utils/Embed.js');

module.exports = class DocCommand extends Command {
	constructor() {
		super({
			name: 'doc',
			description: "Permet de récupérer le lien d'une documentation d'un langage de programmation ou d'une librairie.",
			usage: 'doc <langage/librairie>\ndoc liste\ndoc',
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const {languages} = require('../../assets/jsons/constants.json');
		const embed = Embed.fromTemplate('basic', {
			client,
		});
		embed.setColor('#0faf2f');

		let list = '<:etiquette:635159045187174410> Cliquez sur les langages/librairies pour accéder à leur documentation :\n\n';
		Object.keys(languages).forEach(key => (list += `[${key}](${languages[key]})\n`));
		if (['list', 'liste', 'ls'].includes(args[0]) || args.length === 0) {
			embed.setTitle('<:bnote:635163385645760523> Liste des langages/librairies disponibles :');
			embed.setDescription(list);
			return super.send(embed);
		}

		Object.keys(languages).forEach(key => {
			if (key.toLowerCase().includes(args.join(' ').toLowerCase())) {
				embed.setTitle(`<:ceci:635159045375918092> **Documentation du langage/librairie : __${key}__**`);
				embed.setDescription(languages[key]);
			}
		});

		if (!embed.description) return argError(message, this, "<a:attention:613714368647135245> **Le language n'a pas été trouvé ou n'est pas dans la liste actuelle.**");
		await super.send(embed);
	}
};
