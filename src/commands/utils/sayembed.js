const toEmbed = require('godembed');
const Command = require('../../entities/Command.js');
const Embed = require('../../utils/Embed.js');
const {tryDeleteMessage} = require('../../utils/CommandUtils.js');
const {argError} = require('../../utils/Errors.js');
const {isOwner} = require('../../utils/Utils.js');

module.exports = class SayEmbedCommand extends Command {
	constructor() {
		super({
			name: 'sayembed',
			description:
				"**Système fait par Ghom.**\nPermet de faire parler le bot avec un embedGenerated qui contient du [texte], une multitude d'options pour personnaliser l'embed sont disponibles.",
			usage:
				"``pf\n> Utilisation :\n\n$title Titre de l'embed\n$author Auteur\nImage de l'auteur\nLien cliquable de l'auteur\n\n$description Description de l'embed\n$color Couleur de l'embed (exemple : #ff0000 = rouge)\n$image Lien de l'image\n$thumbnail Petite image en haut à droite de l'embed\n\n$field Titre du field\nDescription du field\nfalse|true (si il est aligné avec les autres ou non)\n\n$footer Texte du footer\nImage du footer\n$end\n\nLa balise 'end' permet de mettre des commentaires entre les balises comme ici.\nFaites g/sayembed info pour avoir plus d'infos.\n\n$timestamp Temps de l'embed, 'now' permet de mettre maintenant.```\n\n`sayembed <texte>\nsayembed info",
			aliases: ['embedsay', 'edire', 'embdire', 'embeddire', 'esay'],
		});
	}

	async run(client, message, args) {
		super.run(client, message, args);

		let channel = message.channel;
		if (args.length === 0) return argError(message, this, "Veuillez mettre du texte pour l'embed ! ");

		if (args[0] === 'info') {
			const embed = Embed.fromTemplate('complete', {
				client,
				title: "Informations supplémentaires sur la génération d'embeds :",
				description: "> __**Page d'aide complète : https://www.npmjs.com/package/godembed**__",
			});
			embed.addField(
				'Variables :',
				`
\`now\` => Date et heure actuelle (pour le \`$timestamp\` uniquement).
\`\${username}\` => Votre nom d'utilisateur.
\`\${userImage}\` => Votre avatar.
\`\${tag}\` => Votre tag.

> **Variables uniquement disponibles sur serveur :**
\`\${guild}\` => Nom du serveur.
\`\${guildImage}\` => Lien de l'image du serveur.
\`\${memberCount}\` => Nombre de membre du serveur.
\`\${nickname}\` => Votre surnom sur le serveur.
`
			);
			embed.addField(
				'Balises supplémentaires :',
				`
\`$end\` => Forcer la fin d'une balise.
\`$and\` => Indiquer qu'il faut passer à l'argument suivant.
\`$blank\` => Texte vide.
\`[Text](lien)\` => Transforme le texte en texte cliquable qui renvoie vers le lien comme [ceci](https://github.com/Ayfri).`
			);

			return super.send(embed);
		}

		if (client.channels.cache.has(args[0]) && isOwner(message.author.id)) {
			args.splice(0, 1);
			channel = client.channels.cache.find(c => c.type === 'text' && c.id === args[0]);
		}

		let text = args
			.join(' ')
			.replace(/\\n/g, '\n')
			.replace(/\${username}/gi, message.author.username)
			.replace(
				/\${userImage}/gi,
				message.author.displayAvatarURL({
					dynamic: true,
					format: 'png',
				})
			)
			.replace(/\${tag}/gi, message.author.tag);

		if (message.guild) {
			text = text
				.replace(/\${nickname}/gi, message.member.nickname)
				.replace(/\${guild}/gi, message.guild.name)
				.replace(
					/\${guildImage}/gi,
					message.guild.iconURL({
						dynamic: true,
						format: 'png',
					})
				)
				.replace(/\${memberCount}/gi, message.guild.memberCount.toString());
		}

		const {embed, errors} = toEmbed(text);
		if (errors.length > 0) await super.send(`\`\`\`js\n${errors.join('\n')}\`\`\``);
		else tryDeleteMessage(message);

		await channel.send({embed});
	}
};
