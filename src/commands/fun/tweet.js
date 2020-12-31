const fetch = require('node-fetch');
const Command = require('../../entities/Command.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');

module.exports = class TweetCommand extends Command {
	constructor() {
		super({
			name: 'tweet',
			description: 'Génère un tweet ! Parfait pour troller vos amis.',
			usage: 'tweet <nom du compte> <contenu du tweet>',
			aliases: ['twt'],
		});
	}

	async run(client, message, args) {
		await super.run(client, message, args);

		const user = encodeURI(args[0]);
		const text = encodeURI(args.join(' '));
		const m = await super.send('<a:gh:539121219987963904> **Génération de votre tweet en cours . . .**');

		if (!user) return m.edit(`**Il manque un nom pour le compte twitter ${message.author}.**`);
		if (!text) return m.edit(`**Il manque un contenu ${message.author}.**`);
		if (user.length > 48) return m.edit(`**Le nom d'utilisateur est trop long, 48 caractères sont le maximum ${message.author}.**`);
		if (text.length > 140) return m.edit(`**Le tweet est trop long, 140 caractères sont le maximum ${message.author}.**`);

		const body = await (await fetch(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${text}`, {method: 'GET'})).json();
		await message.channel?.send(`<:CheckMark:539078939365343257> **Voici le tweet que vous avez demandé ${message.author} !**`, {
			files: [
				{
					attachment: body.message,
					name: 'tweet.png',
				},
			],
		});
		tryDeleteMessage(message);
		tryDeleteMessage(m, 5000);
	}
};
