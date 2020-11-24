const fetch = require('node-fetch');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const Command = require('../../entities/Command.js');

module.exports = class TrumpTweetCommand extends (
	Command
) {
	constructor() {
		super({
			name: 'trumptweet',
			description: 'Venez parler au nom de Donald Trump !',
			usage: 'trumptweet <Texte>',
			aliases: ['tt', 'trump'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		const text = encodeURI(args.join(' '));
		const m = await super.send('<a:gh:539121219987963904> **Génération de votre tweet en cours . . .**');

		if (!text) return m.edit(`**Il manque un contenu ${message.author}.**`);
		if (text.length > 280) return m.edit(`**Le tweet est trop long, 280 caractères sont le maximum ${message.author}.**`);

		const body = await (await fetch(`https://nekobot.xyz/api/imagegen?type=trumptweet&text=${text}`, {method: 'GET'})).json();
		await message.channel?.send(`<:CheckMark:539078939365343257> **Voici le tweet que vous avez demandé ${message.author} !**`, {
			files: [
				{
					attachment: body.message,
					name: 'trumptweet.png',
				},
			],
		});
		tryDeleteMessage(m, 5000);
	}
};
